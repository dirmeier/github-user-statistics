
function print_error() {
    $(".plotbox").show();
    $("#spinner_id").hide();
    $(".plotbox").html("<h6>Could not GET repository information from GitHub API.<br>Some AJAX error.</h6>");
}

function stats(user_name, results) {
    var repo_names = [];
    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        if (result.fork === false) {
            repo_names.push(result.name);
        }
    }

    var language_bytes = {};
    for (i = 0; i < repo_names.length; i++) {
        $.ajax({
            dataType: "json",
            url: "https://api.github.com/repos/" + user_name + "/" + repo_names[i] + "/languages",
            success: function (data) {
                for (var lang in data) {
                    if (!(lang in language_bytes)) {
                        language_bytes[lang] = 0;
                    }
                    language_bytes[lang] = language_bytes[lang] + data[lang];
                }
            },
            error: function () {
                print_error();
            },
            async: false
        });
    }

    /*global barplot */
    barplot("plotbox_id", language_bytes);
}

function query() {
    $("#spinner_id").show();
    $(".plotbox").hide();

    var user_name = $('#searchfield').val();
    $.ajax({
        dataType: "json",
        url: "https://api.github.com/users/" + user_name + "/repos?per_page=1000",
        success: function (result) {
            stats(user_name, result);
        },
        error: function () {
            print_error();
        },
        async: false
    });
}
