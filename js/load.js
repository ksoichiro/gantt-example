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

    let ganttFrom = new Date();
    ganttFrom.setFullYear(2016);
    ganttFrom.setMonth(10);
    ganttFrom.setDate(1);
    let ganttTo = new Date();
    ganttTo.setFullYear(ganttFrom.getFullYear());
    ganttTo.setMonth(ganttFrom.getMonth());
    ganttTo.setDate(ganttFrom.getDate());
    ganttTo.setMonth(ganttTo.getMonth() + 1);
    let $ganttTable = $('.wbs.script .gantt table');
    let $ganttThead = $ganttTable.find('thead');
    let $row = $('<tr></tr>');
    let days = 0;
    for (let i = ganttFrom; i <= ganttTo; i.setDate(i.getDate() + 1)) {
      $row.append(`<th>${(i.getMonth() + 1)}/${i.getDate()}</th>`);
      days++;
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
  }
})();
