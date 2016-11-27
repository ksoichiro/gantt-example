(function() {
  require('../../node_modules/bootstrap/dist/css/bootstrap.css');
  require('../../node_modules/font-awesome/css/font-awesome.css');
  require('../css/main.less');
  window.$ = window.jQuery = require('jquery');
  require('bootstrap');
  let moment = require('moment');
  $(document).ready(() => {
    $.ajax({
      url: '/data.json'
    }).done((data) => {
      render(data);
    });
  });

  $(window).on('resize', () => {
    resizeGantt();
  });

  $('.wbs-container').on('resize', () => {
    if (0 < $('.wbs-container').width()) {
      resizeGantt();
    }
  });

  function resizeGantt() {
    const wbsWidth = 400;
    $('.wbs').width(wbsWidth);
    $('.gantt-container').offset({left: wbsWidth});
    console.log('.wbs-container.width: ' + $('.wbs-container').width());
    $('.gantt-container').width($('.wbs-container').width() - wbsWidth);
  }

  function render(data) {
    let $tbody = $('.wbs tbody');
    let ganttFrom = moment('2016-11-01', 'YYYY-MM-DD');
    let ganttTo = ganttFrom.clone().add(1, 'months');
    let $ganttTable = $('.gantt');
    let grandParentIdClasses = [];
    let lastElem = null;
    data.tasks.forEach((e) => {
      if (lastElem !== null) {
        if (e.level < lastElem.level) {
          for (let i = 0; i < lastElem.level - e.level; i++) {
            grandParentIdClasses.pop();
          }
        } else if (lastElem.level < e.level) {
          let parentIdClass = e.parent ? 'p-' + e.parent : '';
          if (parentIdClass !== '') {
            grandParentIdClasses.push(parentIdClass);
          }
        } // else: do nothing
      }
      let faClass = e.hasChild === true ? 'fa-minus-square-o tree' : 'fa-minus-square-o';
      let trClasses = grandParentIdClasses.concat(['open']);
      if (e.level == 1) {
        trClasses.push('top');
      }
      let startAt = e.startAt ? moment(e.startAt, 'YYYY-MM-DD').format('MM/DD') : '&#160;';
      let endAt = e.endAt ? moment(e.endAt, 'YYYY-MM-DD').format('MM/DD') : '&#160;';
      let row = `<tr id="r-${e.id}" class="${trClasses.join(' ')}" data-id="${e.id}">`;
      row += `<td class="id">${e.id}</td>`;
      row += `<td class="l${e.level} task">`;
      row += `<i class="fa ${faClass}" data-target=".p-${e.id}" /> ${e.title}</td>`;
      row += `<td>${startAt}</td>`;
      row += `<td>${endAt}</td>`;
      row += `<td>&#160;</td>`;
      row += `<td>${e.assignee || ''}</td>`;
      row += `</tr>`;
      let $row = $(row);
      if (e.parent !== null) {
        $row.data('parent', '#r-' + e.parent);
      }
      $tbody.append($row);
      if (e.hasChild === true) {
        let icon = $row.find('i.tree');
        if (icon) {
          icon.on('click', () => {
            let holder = $(icon).parents('tr');
            let $ganttTbody = $ganttTable.find('tbody');
            $tbody.find(icon.data('target')).each((idx, t) => {
              let c = $(t);
              if (holder.hasClass('open')) {
                // going to close
                if (!c.hasClass('hidden')) {
                  c.addClass('hidden');
                  $ganttTbody.find('#g-' + c.data('id')).addClass('hidden');
                  let $bar = $ganttTable.find('#b-' + c.data('id'));
                  if ($bar) {
                    $bar.addClass('hidden');
                  }
                }
              } else {
                // going to open
                if (c.hasClass('hidden')) {
                  let p = $(c.data('parent'));
                  if (holder.attr('id') === p.attr('id') || p.hasClass('open')) {
                    c.removeClass('hidden');
                    $ganttTbody.find('#g-' + c.data('id')).removeClass('hidden');
                    let $bar = $ganttTable.find('#b-' + c.data('id'));
                    if ($bar) {
                      $bar.removeClass('hidden');
                    }
                  }
                }
              }
            });
            icon.toggleClass('fa-minus-square-o');
            icon.toggleClass('fa-plus-square-o');
            holder.toggleClass('open');
          });
        }
      }
      lastElem = e;
    });

    let $ganttThead = $ganttTable.find('thead');
    let $row = $('<tr></tr>');
    let days = 0;
    for (let i = ganttFrom.clone(); i.isSameOrBefore(ganttTo); i.add(1, 'days')) {
      days++;
      $row.append(`<th class="gantt-${days} d-${i.month()}-${i.date()}">${i.month()+1}/${i.date()}</th>`);
    }
    $ganttThead.append($row);

    let $ganttTbody = $ganttTable.find('tbody');
    data.tasks.forEach(function(e) {
      let trClasses = [];
      if (e.level == 1) {
        trClasses.push('top');
      }
      let $row = $(`<tr id="g-${e.id}" class="${trClasses.join(' ')}" data-wbs="r-${e.id}"></tr>`);
      for (let i = 0; i < days; i++) {
        $row.append('<td>&#160;</td>');
      }
      $ganttTbody.append($row);
    });
    let dayWidth = $('.gantt-1').outerWidth();
    let dayHeight = $ganttTable.find('tbody tr td').outerHeight();
    data.tasks.forEach(function(e, idx) {
      if (e.startAt && e.endAt) {
        const paddingTop = 2;
        const paddingBottom = 2;
        let start = moment(e.startAt).diff(ganttFrom, 'days');
        let duration = moment(e.endAt, 'YYYY-MM-DD').diff(moment(e.startAt, 'YYYY-MM-DD'), 'days') + 1;
        let $row = $ganttTable.find(`tbody tr#g-${e.id}`);
        let barTop = $row.position().top + paddingTop;
        let barHeight = $row.outerHeight() - paddingTop - paddingBottom;
        let barWidth = dayWidth * duration;
        $ganttTable.append(`<div class="bar" id="b-${e.id}" style="top: ${barTop}px; left: ${dayWidth * start}px; height: ${barHeight}px; width: ${barWidth}px;"></div>`);
      }
    });
  }
})();
