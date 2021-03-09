var console = console;
if(chrome.extension.getBackgroundPage() != null)
  console = chrome.extension.getBackgroundPage().console;

$(function() {
    var userId = "";
    //UserId
    chrome.storage.sync.get('userId', function(items) {
        userId = items.userId;
        if (!userId) {
            userId = functs.guid();
            chrome.storage.sync.set({userId: userId});
        }
    });
    //Options link
    $('#idSettings').click(function() {
        chrome.tabs.update({ url: chrome.extension.getURL("options.html") });
        window.close();
    });
    $('#dashboard').click(function() {
        chrome.tabs.update({ url: "/dashboard.html" });
        window.close();
    });
    $('#notelist').click(function() {
        chrome.tabs.update({ url: chrome.extension.getURL("options.html#tabs-3") });
        window.close();
    });

    $('#add-postit-dashboard').click(function() {
        abm.sendMessage('newdashboard');
        postitShown = true;
        window.close();
    }).removeClass('disabled');
});

var popup = [];

popup.setMenu = function() {

    $('.page-option').show();

    $('#add-postit').click(function() {
        console.log('new');
        abm.sendMessage('new');
        postitShown = true;
        window.close();
    }).removeClass('disabled');

    $('#viewhide-postit').click(function() {
        abm.sendMessage('viewhide');
        abm.autoloadEnabled = false;
    }).removeClass('disabled');

    $('#viewexport-postit').click(function() {
        abm.sendMessage('export');
        window.close();
    }).removeClass('disabled');

    $('#viewimport-postit').click(function() {
        abm.sendMessage('import');
        window.close();
    }).removeClass('disabled');

    $('#hide-postit').click(function() {
        abm.sendMessage('hide');
        postitShown = false;
        abm.autoloadEnabled = false;
    }).removeClass('disabled');
    $('#view-postit').click(function() {
        abm.sendMessage('show');
        postitShown = true;
        abm.autoloadEnabled = false;
    }).removeClass('disabled');

    $('#delete-postit').click(function() {
        abm.sendMessage('delete');
        window.close();
    }).removeClass('disabled');

    $('#share-postit').click(function() {
        abm.sendMessage('share', 'all');
    }).removeClass('disabled');

    $('#export-postit').click(function() {
        abm.sendMessage('export');
        window.close();
    }).removeClass('disabled');

    $('#import-postit').click(function() {
        abm.sendMessage('import');
        postitShown = true;
        window.close();
    }).removeClass('disabled');

    $('#custom-postit').click(function() {
        $('#menu').hide();
        $('#cutom-postit-options').show();
    }).removeClass('disabled');
    $('.custom-postit').click(function() {
        abm.sendMessage('new_' + $(this).data('cssclass'));
        postitShown = true;
        window.close();
    }).removeClass('disabled');
    $('.close-submenu').click(function() {
        $('#menu').show();
        $('#cutom-postit-options').hide();
        $('#postit-options').hide();
    }).removeClass('disabled');

    $('#options').click(function() {
        $('#menu').hide();
        $('#postit-options').show();
    }).removeClass('disabled');
}

popup.setMenuOff = function() {

    $('.page-option').hide();

    $('#add-postit').click(function(e) {
      e.preventDefault();
    }).addClass('disabled');

    $('#viewhide-postit').click(function(e) {
        e.preventDefault();
    }).addClass('disabled');

    $('#hide-postit').click(function(e) {
        e.preventDefault();
    }).addClass('disabled');

    $('#view-postit').click(function(e) {
        e.preventDefault();
    }).addClass('disabled');

    $('#delete-postit').click(function(e) {
        e.preventDefault();
    }).addClass('disabled');

    $('#share-postit').click(function(e) {
        e.preventDefault();
    }).addClass('disabled');

    $('#export-postit').click(function(e) {
        e.preventDefault();
    }).addClass('disabled');

    $('#import-postit').click(function(e) {
        e.preventDefault();
    }).addClass('disabled');
}

//Fired when DOM was loaded
document.addEventListener('DOMContentLoaded', function() {

  //Get selected tab
  chrome.tabs.getSelected(null,function(tab) {

    //Restore options
    abm._Restore(function() {

        var setMenuState = function(url) {
            if(functs.checkUrl(url) && abm.state) {
                popup.setMenu();
            } else {
                popup.setMenuOff();
            }
        }

        //state
        abm.initState('reload', function() {
            setMenuState(tab.url);
            window.close();
        });
        setMenuState(tab.url);

        if(abm.trayIconMenu) {
            //Show popup
            setTimeout(function() { $('#idContanier').show('fast', function() { $(this).css('display', ''); }) }, 100);
        } else {
            window.close();
            var domain = functs.getUniqueId(tab.url);
            console.log('domain', tab.url, domain);
            if(domain && abm.state) {
                if(domain === "Dashboard")
                    abm.sendMessage('newdashboard', '');
                else
                    abm.sendMessage('new', '');
                postitShown = true;
            } else {
                abm.sendMessage('alert', "We can't create notes in the current page due to chrome restrictions.");
            }
        }

    });

  });

});
