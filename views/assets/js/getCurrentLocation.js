$(document).ready(function() {
    var headers = {
        'Content-Type': 'application/atom+xml',
        'Authorization': 'Bearer ACCESS_TOKEN'
        'GData-Version': 2
        'X-GData-Key': 'key=DEVELOPER_KEY'
     };
     
    function post('http://weatherupdates.herokuapp.com/resultLocation', data, headers, success) {
        $.ajax({
            beforeSend: function(xhr){
                $.each(headers, function(key, val) {
                    xhr.setRequestHeader(key, val);
                });
                xhr.setRequestHeader('Content-Length', data.length);
            }
            type: "POST",
            url: url,
            processData: false,
            data: data,
            dataType: "xml",
            success: success
        });
    }
});