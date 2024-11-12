function modifiedTitle(pageName = document.title) {
    lastUpdate = new Date (document.lastModified);
    updateMonth = (lastUpdate.getMonth() + 1).toString();
    updateDay = lastUpdate.getDate().toString();
    updateYear = lastUpdate.getYear().toString().substr(-2);

    document.title = pageName + " | CPC NEW HAVEN | as of " + updateMonth + "." + updateDay + "." + updateYear;
}