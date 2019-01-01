// ==UserScript==
// @name         Triplebyte Company QBR Stats
// @namespace    triplebyte.com/back/companies
// @version      0.1
// @description  Display company statistics for QBRs
// @author       Katrina, Rebecca, + Priscilla Bushko
// @match        https://*triplebyte.com/back/companies/*
// @grant        none
// ==/UserScript==

var acceptedClass = 'green-text';
var rejectedClass = 'red-text';
var expiredClass = 'orange-text';
var withdrawnClass = 'gray-link';
var rejectionReasons = [];

window.onload = function () {

    var headerBar = document.getElementsByClassName('flex justify-between w-full')[0];

    var btn = document.createElement("BUTTON");
    btn.innerText = '  Get Stats  ';
    btn.setAttribute('type', 'button');
    btn.setAttribute('width', '100px');

    btn.onclick = function() {
        processCallRequests();
        processPitchCalls();
        proccessOnsites();

        processRejectionReasons();
    };

    headerBar.appendChild(btn);
}

function processCallRequests() {

    let table = document.getElementById('company-stats-detail-table-call_requests');

    let accepted = table.getElementsByClassName(acceptedClass).length;
    let rejected = table.getElementsByClassName(rejectedClass).length;
    let expired = table.getElementsByClassName(expiredClass).length;

    //add in the rejcetion reasons
    let rejectReason = table.getElementsByTagName('small');
    for (let i = 0; i < rejectReason.length; i++) {
        rejectionReasons.push(rejectReason[i].innerText);
    }

    console.log('Call Requests\n----------------------\nAccepted: ' + accepted +
                '\nRejected: ' + rejected + '\nExpired: ' + expired +
                '\nTotal: ' + (accepted + rejected + expired) + '\n----------------------');
}

function processPitchCalls() {

    let table = document.getElementById('table-details-pitch_calls');
    let rows = table.getElementsByTagName('tr');

    let advancedByCompany = 0;
    let advancedByCandidate = 0;
    let advancedByBoth = 0;
    let completed = 0;

    for (let i = 1; i < rows.length; i++) {
        let companyOutcome = rows[i].getElementsByTagName('td')[2].getElementsByTagName('span')[0].getElementsByTagName('span')[0].className;
        let candidateOutcome = rows[i].getElementsByTagName('td')[4].getElementsByTagName('span')[0].getElementsByTagName('span')[0].className;

        if (companyOutcome == acceptedClass || companyOutcome == rejectedClass) {
            completed++;
        }

        if (companyOutcome == acceptedClass && candidateOutcome == acceptedClass) {
            advancedByBoth++;
        }

        if (companyOutcome == acceptedClass) {
            advancedByCompany++;
        }

        if (candidateOutcome == acceptedClass) {
            advancedByCandidate++;
        }

        //getting the rejection reasons
        let col = rows[i].getElementsByTagName('td')[4].getElementsByTagName('small');
        //the length is 2 when there is a rejection reason
        if (col.length == 2) {
            rejectionReasons.push(col[1].innerText);
        }
    }

    console.log('Pitch Calls\n----------------------\nAdvanced by Company: ' + advancedByCompany +
                '\nAdvanced by Candidate: ' + advancedByCandidate + '\nAdvanced by Both: ' + advancedByBoth +
                '\nCompleted: ' + completed + '\n----------------------');
}

function proccessOnsites() {

    let table = document.getElementById("company-stats-detail-table-onsites");
    let rows = table.getElementsByTagName('tr');

    let completed = 0;

    for (let i = 1; i < rows.length; i++) {
        var dateString = rows[i].getElementsByTagName('td')[5].innerText;
        dateString = dateString.substring(dateString.length - 4);

        if (dateString == '2018') {
            completed++;
        }
    }

    console.log('Onsites\n----------------------\nCompleted: ' + completed + '\n----------------------');
}

function processRejectionReasons() {

    let reasonMap = new Map();
    reasonMap.set("Risk too high", 0);
    reasonMap.set("Values/mission not aligned", 0);
    reasonMap.set("Role not a fit", 0);
    reasonMap.set("Wrong company size for me", 0);
    reasonMap.set("Product not exciting", 0);
    reasonMap.set("Never heard of them", 0);
    reasonMap.set("Tech not exciting", 0);

    let otherLen = 0;
    let other = "";

    //go through each rejection reason and categorize it
    for (let i = 0; i < rejectionReasons.length; i++) {
        if (!rejectionReasons[i].includes("(Didn't want to share reason with company)")) {
            if (reasonMap.has(rejectionReasons[i])) {
                let val = reasonMap.get(rejectionReasons[i]);
                reasonMap.set(rejectionReasons[i], val + 1);
            } else {
                other = other + rejectionReasons[i].substring(7) + "\n";
                otherLen++;
            }
        }
    }

    let str = 'Rejection Reasons\n----------------------';
    reasonMap.forEach(function(value, key, map) {
        str += '\n' + key + ": " + value;
    });
    str += "\nOther: " + otherLen + "\n" + other;

    //print the results
    console.log(str);
}
