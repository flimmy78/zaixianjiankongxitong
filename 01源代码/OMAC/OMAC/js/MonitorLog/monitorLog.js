﻿// 查询的表名
var monitorType = "";
var defaultMonitorType = "";

$(function () {
    // 默认的devicecode
    var defaultDevicecode = QueryString.devicecode;
    defaultMonitorType = QueryString.monitorType;
    var defaultBeginTime = QueryString.beginTime == null ? moment(new Date().addDays(-10)).format("YYYY-MM-DD HH:mm:ss") : QueryString.beginTime;
    var defaultEndTime = QueryString.endTime == null ? moment(new Date()).format("YYYY-MM-DD HH:mm:ss") : QueryString.endTime;

    // 绑定浮标号下拉框
    $.getJSON(
        "/api/monitorlog/GetDeviceList",
        { "devicecode": defaultDevicecode },
        function (data) {

            var fbaj = data[0].DEVICETYPE;

            // 标签文字
            var lbltext = fbaj === 2 ? "设备名称：" : "设备名称：";
            $("#lbl-fb").text(lbltext);

            // 默认表名参数的值
            defaultMonitorType = defaultMonitorType == null ? (fbaj === 2 ? "TABBUOYECOLOGY0" : "TABECOLOGY0") : defaultMonitorType;
            // 默认表名
            monitorType = defaultMonitorType.slice(0, -1);

            // 按钮
            $("#btn-mtp").html(ButtonHtmls[fbaj]);
            $("#btn-mtp>button").attr("class", "btn btn-default blankBtn");
            $("#btn-mtp>button[data-mtp=\"" + defaultMonitorType + "\"]").attr("class", "btn btn-primary blueBtn");
            $("#btn-mtp>button").on("click", function () {
                var mtp = $(this).data("mtp");
                var beginTime = $("input[name=\"daterange\"]").data("daterangepicker").startDate.format("YYYY-MM-DD HH:mm:ss");
                var endTime = $("input[name=\"daterange\"]").data("daterangepicker").endDate.format("YYYY-MM-DD HH:mm:ss");
                window.location.href = "index?devicecode=" + $("select[name=\"devicecode\"]").val() + "&monitorType=" + mtp + "&beginTime=" + beginTime + "&endTime=" + endTime;
            });

            var items = [];
            $.each(data, function (key, val) {
                items.push("<option value='" + val.DEVICECODE + "'>" + val.DEVICENAME + "</option>");
            });

            $("select[name=\"devicecode\"]").html(items.join(""));
            $("select[name=\"devicecode\"]").val(defaultDevicecode);

            InitData();

            $("select[name=\"devicecode\"]").on("change", function () {
                GetData();
            });

        });


    // 初始化 datetime range picker 控件
    $("input[name=\"daterange\"]").daterangepicker(
        {
            "timePicker": true,
            "timePicker24Hour": true,
            "timePickerSeconds": true,
            "locale": {
                "format": "YYYY-MM-DD HH:mm:ss",
                "separator": " - ",
                "applyLabel": "确定",
                "cancelLabel": "取消",
                "fromLabel": "From",
                "toLabel": "To",
                "customRangeLabel": "Custom",
                "weekLabel": "W",
                "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
                "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                "firstDay": 1
            },
            startDate: defaultBeginTime,
            endDate: defaultEndTime
        },
        function () {
            GetData();
        }

    );

});

function InitData() {
    var beginTime = $("input[name=\"daterange\"]").data("daterangepicker").startDate.format("YYYY-MM-DD HH:mm:ss");
    var endTime = $("input[name=\"daterange\"]").data("daterangepicker").endDate.format("YYYY-MM-DD HH:mm:ss");
    var tableDataUrl = "/api/monitorlog/GetList?tableName=" + monitorType + "&devicecode=" + $("select[name=\"devicecode\"]").val() + "&beginTime=" + beginTime + "&endTime=" + endTime;

    $("#table").bootstrapTable({
        striped: true,
        pagination: true,
        height: "600",
        sidePagination: "server",
        url: tableDataUrl,
        pageSize: 10,
        pageList: "[5, 10, 20, 50, 100, 200]",
        columns: DataColumns[defaultMonitorType],
        onLoadSuccess: function () {

            var tableDatas = $("#table").bootstrapTable("getData");

            var href = tableDatas.length > 0
                ? "ExportExcel?tableName=" + monitorType + "&devicecode=" + $("select[name=\"devicecode\"]").val() + "&beginTime=" + beginTime + "&endTime=" + endTime + "&order=" + defaultMonitorType + "&offset=0&limit=65500"
                : "javascript::;";
            $("#btn-excel").attr("href", href);

        }
    });


}

function GetData() {
    var beginTime = $("input[name=\"daterange\"]").data("daterangepicker").startDate.format("YYYY-MM-DD HH:mm:ss");
    var endTime = $("input[name=\"daterange\"]").data("daterangepicker").endDate.format("YYYY-MM-DD HH:mm:ss");
    var tableDataUrl = "/api/monitorlog/GetList?tableName=" + monitorType + "&devicecode=" + $("select[name=\"devicecode\"]").val() + "&beginTime=" + beginTime + "&endTime=" + endTime;

    $("#table").bootstrapTable("refreshOptions", {
        url: tableDataUrl
    });
}

function AlertCheck()
{
    if ($("#btn-excel").attr("href") == "javascript::;")
    {
        parent.bootbox.alert({ buttons: { ok: { label: '关闭', className: 'btn btn-blue button_btn' } }, message: "<h4 style='text-align:center'>无可导出数据，请尝试修改数据查询条件！</h4>" });
    }
}




var ButtonHtmls = function () {
    var arr2 = [], arr1 = [];
    arr2.push("<button type=\"button\" data-mtp=\"TABBUOYECOLOGY0\">水质</button>",
        "<button type=\"button\" data-mtp=\"TABBUOYSTATUS0\">状态</button>",
        "<button type=\"button\" data-mtp=\"TABBUOYHYDROLOGY0\">波浪</button>",
        "<button type=\"button\" data-mtp=\"TABBUOYHYDROLOGY1\">海流</button>",
        "<button type=\"button\" data-mtp=\"TABBUOYQIXG0\">气象</button>",
        "<button type=\"button\" data-mtp=\"TABBUOYQIXG1\">风</button>",
        "<button type=\"button\" data-mtp=\"TABBUOYQIXG2\">气压</button>",
        "<button type=\"button\" data-mtp=\"TABBUOYQIXG3\">气温</button>",
        "<button type=\"button\" data-mtp=\"TABBUOYQIXG4\">湿度</button>");
    arr1.push("<button type=\"button\" data-mtp=\"TABECOLOGY0\">水质</button>",
        "<button type=\"button\" data-mtp=\"TABSTATUS0\">状态</button>",
        "<button type=\"button\" data-mtp=\"TABHYDROLOGY0\">波浪</button>",
        "<button type=\"button\" data-mtp=\"TABHYDROLOGY1\">海流</button>",
        "<button type=\"button\" data-mtp=\"TABQIXG0\">气象</button>",
        "<button type=\"button\" data-mtp=\"TABQIXG1\">风</button>",
        "<button type=\"button\" data-mtp=\"TABQIXG2\">气压</button>",
        "<button type=\"button\" data-mtp=\"TABQIXG3\">气温</button>",
        "<button type=\"button\" data-mtp=\"TABQIXG4\">湿度</button>");
    var rst = {
        2: arr2.join("&nbsp;"),
        1: arr1.join("&nbsp;")
    };
    return rst;
}();














var QueryString = function () {
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}();

Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}