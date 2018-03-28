var iso = new Isotope('#previews', {
    itemSelector: '.preview',
    layoutMode: 'fitRows'
});

var filter         = document.getElementById('filter'),
    filterSentence = document.getElementById('filter-sentence'),
    filters        = filter.getElementsByClassName('select'),
    selections     = filter.getElementsByClassName('options'),
    metrics        = [],
    options        = [],
    optionsContent = [],
    currentFilter  = 'none',
    selectionFadeIn, selectionFadeInTimer, selectionFadeOut, selectionFadeOutTimer;

metrics['scrollH'] = 0;
metrics['padding'] = 0;
metrics['scrollT'] = 0;
metrics['offsetH'] = 0;
metrics['inactiv'] = 0;

var temp = [];
for(var i = 0, l = filters.length; i < l; i++) {
    temp[filters[i].dataset.filter] = filters[i];
}
filters = temp;
temp    = [];
for(var i = 0, l = selections.length; i < l; i++) {
    var f             = selections[i].dataset.filter;
    temp[f]           = selections[i];
    options[f]        = [];
    optionsContent[f] = [];
    var o = selections[i].getElementsByClassName('option');
    for(var j = 0, ll = o.length; j < ll; j++) {
        options[f].push(o[j]);
        optionsContent[f].push(o[j].innerHTML);
        if(j == 0) filters[f].innerHTML = optionsContent[f][0];
    }
}
selections = temp;
temp       = [];

function openSelection(e) {
    e.stopPropagation();
    if(currentFilter != 'none') {
        if(currentFilter == this.dataset.filter) {
            clearTimeout(selectionFadeOutTimer);
        } else {
            closeCurrentFilter(e);
        }
    }
    currentFilter = this.dataset.filter;
    this.classList.add('inactive');
    filter.classList.add('active');
    filterSentence.classList.add('inactive');
    selections[currentFilter].classList.add('active');
    var offsetPos = getRelativePos(this, filter);
    selections[currentFilter].style.paddingTop = offsetPos.y + 'px';
    selections[currentFilter].style.paddingBottom = offsetPos.y + 'px';
    selections[currentFilter].style.top = 0;
    selections[currentFilter].style.left = offsetPos.x + 'px';
    selectionFadeIn = true;
    selectionFadeInTimer = setTimeout(function() {
        metrics['scrollH'] = selections[currentFilter].scrollHeight;
        metrics['padding'] = parseInt(selections[currentFilter].style.paddingTop);
        metrics['scrollT'] = selections[currentFilter].scrollTop;
        metrics['offsetH'] = options[currentFilter][0].offsetHeight;
        metrics['inactiv'] = selections[currentFilter].getElementsByClassName('inactive').length;
        selectionFadeIn = false;
    }, 500);
}

function resetFilterSentencePosition(e) {
    filterSentence.style.transform = '';
    filterSentence.style.transitionDuration = '';
    filters[this.dataset.filter].innerHTML = options[this.dataset.filter][0].innerHTML;
}

function changeFilterSentencePosition(e) {
    if(!selectionFadeIn && !selectionFadeOut) {
        var mouseY = getRelativePointerPos(e, this).y;
        filterSentence.style.transitionDuration = '0s';
        var y = mouseY + metrics['scrollT'] - metrics['padding'] - metrics['offsetH'] / 2;
        if(y < 0) y = 0;
        else if(y > metrics['scrollH'] - (1 + metrics['inactiv']) * metrics['offsetH'] - metrics['padding'] * 2) {
            y = metrics['scrollH'] - (1 + metrics['inactiv']) * metrics['offsetH'] - metrics['padding'] * 2;
        }
        filterSentence.style.transform = 'translateY(' + (y - metrics['scrollT']) + 'px)';
        for(var i = 0, l = options[currentFilter].length; i < l; i++) {
            if(y < options[currentFilter][i].offsetTop) {
                filters[currentFilter].innerHTML = options[currentFilter][i].innerHTML;
                break;
            }
        }
    }
}

function closeCurrentFilter(e, reset) {
    filterSentence.style.transform = '';
    filterSentence.style.transitionDuration = '';
    filterSentence.classList.remove('inactive');
    selectionFadeOut = true;
    filters[currentFilter].classList.remove('inactive');
    selections[currentFilter].classList.remove('active');
    selections[currentFilter].removeEventListener('mouseleave', resetFilterSentencePosition);
    selectionFadeOutTimer = setTimeout((function() {
        selections[this].style.paddingTop = '';
        selections[this].style.paddingBottom = '';
        selections[this].style.top = '';
        selections[this].style.left = '';
        selections[this].scrollTop = 0;
        if(reset) {
            currentFilter = 'none';
        }
        selectionFadeOut = false;
    }).bind(currentFilter), 500);
}

function selectNewFilter(e) {
    e.stopPropagation();
    if(!this.classList.contains('inactive')) {
        filter.classList.remove('active');
        filters[currentFilter].innerHTML = this.innerHTML;
        options[currentFilter][0].innerHTML = this.innerHTML;
        if(this.parentNode.dataset.filter == 'from') {
            for(var i = 0, l = options['to'].length; i < l; i++) {
                options['to'][i].classList.remove('inactive');
                if((this.innerHTML == 'now' && options['to'][i].innerHTML != 'now') || (this.innerHTML != 'now' && parseInt(this.innerHTML) > parseInt(options['to'][i].innerHTML))) {
                    options['to'][i].classList.add('inactive');
                }
            }
        } else if(this.parentNode.dataset.filter == 'to') {
            for(var i = 0, l = options['from'].length; i < l; i++) {
                options['from'][i].classList.remove('inactive');
                if(this.innerHTML != 'now' && (parseInt(this.innerHTML) < parseInt(options['from'][i].innerHTML) || options['from'][i].innerHTML == 'now')) {
                    options['from'][i].classList.add('inactive');
                }
            }
        }
        for(var i = 0, n = 1, l = optionsContent[currentFilter].length; i < l; i++) {
            if(optionsContent[currentFilter][i] != options[currentFilter][0].innerHTML) {
                options[currentFilter][n++].innerHTML = optionsContent[currentFilter][i];
            }
        }
        iso.arrange({
            filter: function(item) {
                var itemYear = parseInt(item.dataset.year),
                    itemType = item.dataset.type,
                    now      = (new Date()).getFullYear(),
                    from     = filters['from'].innerHTML == 'now' ?
                               now : parseInt(filters['from'].innerHTML),
                    to       = filters['to'].innerHTML == 'now' ?
                               now : parseInt(filters['to'].innerHTML),
                    type     = filters['type'].innerHTML;
                if(itemYear >= from && itemYear <= to || itemYear == -1) {
                    if(itemType == type || type == 'all' || itemType == "all") {
                        return true;
                    }
                }
                return false;
            }
        });
        closeCurrentFilter(e, true);
    }
}

function closeFilter(e) {
    e.stopPropagation();
    if(this.classList.contains('active')) {
        filter.classList.remove('active');
        filters[currentFilter].innerHTML = options[currentFilter][0].innerHTML;
        closeCurrentFilter(e, true);
    }
}

for(var key in filters) {
    filters[key].addEventListener('click', openSelection, false);
}

for(var key in filters) {
    selections[key].addEventListener('mouseenter', function(e) {
        selections[this.dataset.filter].addEventListener('mouseleave', resetFilterSentencePosition, false);
    }, false);

    selections[key].addEventListener('mousemove', changeFilterSentencePosition, false);
}

for(var key in options) {
    for(var i = 0, l = options[key].length; i < l; i++) {
        options[key][i].addEventListener('click', selectNewFilter, false);
    }
}

filter.addEventListener('click', closeFilter, false);
