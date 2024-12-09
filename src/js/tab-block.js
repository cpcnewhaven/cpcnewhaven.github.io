function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    // Hide all tab contents
    tabcontent = document.getElementsByClassName("tab-block-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the active class from all tab links
    tablinks = document.getElementsByClassName("tab-block-tab");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab and add an active class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Open the first tab by default for each widget
document.addEventListener("DOMContentLoaded", function() {
    var tabWidgets = document.querySelectorAll(".tab-widget");
    tabWidgets.forEach(function(widget) {
        var firstTab = widget.querySelector(".tab-block-tab");
        if (firstTab) {
            firstTab.click();
        }
    });
});