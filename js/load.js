(function() {
  $(document).ready(() => {
    $.ajax({
      url: '/js/data.json'
    }).done((data) => {
      render(data);
    });
  });

  function render(data) {
    let $tbody = $('.wbs.script table.wbs tbody');
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
      let row = `<tr id="r-${e.id}" class="${trClasses.join(' ')}">`;
      row += `<td class="id">${e.id}</td>`;
      row += `<td class="l${e.level} task">`;
      row += `<i class="fa ${faClass}" data-target=".p-${e.id}" /> ${e.title}</td>`;
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
            $tbody.find(icon.data('target')).each((idx, t) => {
              let c = $(t);
              if (holder.hasClass('open')) {
                // going to close
                if (!c.hasClass('hidden')) {
                  c.addClass('hidden');
                }
              } else {
                // going to open
                if (c.hasClass('hidden')) {
                  let p = $(c.data('parent'));
                  if (holder.attr('id') === p.attr('id') || p.hasClass('open')) {
                    c.removeClass('hidden');
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

    let ganttFrom = moment('2016-11-01', 'YYYY-MM-DD');
    let ganttTo = ganttFrom.clone().add(1, 'months');
    let $ganttTable = $('.wbs.script .gantt table');
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
      let $row = $('<tr></tr>');
      for (let i = 0; i < days; i++) {
        $row.append('<td>&#160;</td>');
      }
      $ganttTbody.append($row);
    });
    let dayWidth = $('.gantt-1').outerWidth();
    let dayHeight = $ganttTable.find('tbody tr td').outerHeight();
    data.tasks.forEach(function(e, idx) {
      if (e.startAt && e.endAt) {
        let start = moment(e.startAt).diff(ganttFrom, 'days');
        let duration = moment(e.endAt, 'YYYY-MM-DD').diff(moment(e.startAt, 'YYYY-MM-DD'), 'days') + 1;
        $ganttTable.append(`<div class="bar" style="top: ${32 + dayHeight * idx}px; left: ${dayWidth * start}px; height: ${dayHeight - 1}px; width: ${dayWidth * duration}px;"></div>`);
      }
    });
  }
})();
