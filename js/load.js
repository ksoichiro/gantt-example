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
    data.tasks.forEach((e) => {
      let $row = $(`<tr><td class="id">${e.id}</td><td class="l${e.level} task">${e.title}</td><td>&#160;</td><td>${e.assignee || ''}</td></tr>`);
      $tbody.append($row);
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
