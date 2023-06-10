// Data and maximum number of draft picks in a year 
var data;
var maxDraftPicks = -Infinity;

//
const urlStart = "https://www.basketball-reference.com/";
const teamColors = {
    "atl": ['#C8102E', '2px solid #FDB927'],
    "bos": ['#007A33', '2px solid #FFFFFF'],
    "brk": ['#000000', '2px solid #FFFFFF'],
    "chi": ['#CE1141', '2px solid #000000'],
    "cho": ['#00788C', '2px solid #1D1160'],
    "cle": ['#860038', '2px solid #FDBB30'],
    "dal": ['#0053BC', '2px solid #00285E'],
    "den": ['#0E2240', '2px solid #8B2131'],
    "det": ['#1D42BA', '2px solid #C8102E'],
    "gsw": ['#1D428A', '2px solid #FFC72C'],
    "hou": ['#CE1141', '2px solid #FFFFFF'],
    "ind": ['#FDBB30', '2px solid #002D62'],
    "lac": ['#C8102E', '2px solid #1D428A'],
    "lal": ['#FDB927', '2px solid #552583'],
    "mem": ['#5D76A9', '2px solid #12173F'],
    "mia": ['#F9A01B', '2px solid #98002E'],
    "mil": ['#00471B', '2px solid #EEE1C6'],
    "min": ['#0C2340', '2px solid #78BE20'],
    "nop": ['#0C2340', '2px solid #85714D'],
    "nyk": ['#006BB6', '2px solid #F58426'],
    "okc": ['#007AC1', '2px solid #EF3B24'],
    "orl": ['#0077C0', '2px solid #C4CED4'],
    "phi": ['#006BB6', '2px solid #FFFFFF'],
    "pho": ['#E56020', '2px solid #1D1160'],
    "por": ['#000000', '2px solid #C8102E'],
    "sac": ['#5A2D81', '2px solid #63727A'],
    "sas": ['#C4CED4', '2px solid #000000'],
    "tor": ['#CE1141', '2px solid #A1A1A4'],
    "uta": ['#000000', '2px solid #FEF056'],
    "was": ['#002B5C', '2px solid #E31837'],
  };

Papa.parse("stats_all.csv", {
    download: true,
    header: true,
    complete: function (results) {
        data = results.data
        generateGrid(data);
    }
});

function generateGrid(data) {
    var gridContainer = document.getElementById("grid-container");
    var years = [];
    var yearPicksDict = {};

    // Extract years and draft picks from the data
    data.forEach(function (item) {
        var year = item.year;

        // Add each year to the list of years
        if (year && !years.includes(year)) {
            years.push(year);
        }

        // Add each year to the dictionary as the keys, and the number of draft picks as the values
        if (year in yearPicksDict) {
            yearPicksDict[year] += 1;
        } else {
            yearPicksDict[year] = 1;
        }

    });

    // Label
    var gridTitle = document.createElement("h2");
    gridTitle.id = "grid-title";
    gridTitle.textContent = "All Draft Picks Since the NBA-ABA Merger";
    gridContainer.appendChild(gridTitle);

    var gridSubtitle = document.createElement("p");
    gridSubtitle.id = "grid-subtitle";
    gridSubtitle.textContent = "Click on a player to go to their Basketball Reference page"
    gridContainer.appendChild(gridSubtitle);

    // Generate the grid
    var gridTable = document.createElement("table");
    gridTable.id = "grid-table";
    var headerRow = document.createElement("tr");
    gridTable.appendChild(headerRow);

    // Generate empty cell for the left-hand side
    var emptyHeaderCell = document.createElement("th");
    headerRow.appendChild(emptyHeaderCell);

    // Generate header row with years shifted to the right
    // // 
    years.forEach(function (year) {
        var th = document.createElement("th");
        th.textContent = "'" + year.substring(2);
        headerRow.appendChild(th);
    });

    // Find max value of the dictionary
    for (var key in yearPicksDict) {
        if (key in yearPicksDict) {
            var value = yearPicksDict[key];
            if (value > maxDraftPicks) {
                maxDraftPicks = value;
            }
        }
    }

    // Generate a row if we're below the max draft pick
    for (let i = 0; i < maxDraftPicks; i++) {
        var row = document.createElement("tr")
        gridTable.appendChild(row);

        // Add the pick number on the left-hand side
        var pickNumberCell = document.createElement("td");
        pickNumberCell.textContent = (i + 1).toString();
        row.appendChild(pickNumberCell);

        // Iterate through each year in the row
        for (let j = 0; j < years.length; j++) {
            var cell = document.createElement("td");

            curYear = j + 1977;
            curPick = i + 1;
            cell.id = JSON.stringify([curYear, curPick]);

            // Add event listeners to each cell
            cell.addEventListener("mouseover", function (event) {
                var target = event.target;
                var player = getPlayerFromCell(target);
                if (player) {
                    showPlayerBox(target, player.name);
                }
            });

            cell.addEventListener("click", function (event) {
                var target = event.target;
                var player = getPlayerFromCell(target);
                if(player){
                    urlEnd = player.link;
                    url = urlStart + urlEnd;
                    window.open(url, "_blank");
                } 
            });

            cell.addEventListener("mouseout", function (event) {
                var target = event.target;
                var playerBox = document.querySelector(".player-box");
                if (playerBox && !cell.contains(target)) {
                    document.body.removeChild(playerBox);
                }
            });

            row.appendChild(cell);

            // If the year had that pick, add cell style 1 which makes it visible
            if (i < yearPicksDict[j + 1977] + 1 && getPlayer(curYear, curPick)) {
                cell.style.backgroundColor = "#444";
                cell.style.border = "1px solid #000000";
                // If the year didn't have that pick, add cell style 2 which makes it invisible
            } else {
                cell.style.border = "1px transparent";
                cell.style.opacity = "0";
            }
        }
    }

    gridContainer.appendChild(gridTable);

    // Helper function to retrieve player from cell
    function getPlayerFromCell(cell) {
        var id = cell.id;
        if (id) {
            var [year, pick] = JSON.parse(id);
            return getPlayer(year, pick);
        }
        return null;
    }

    function showPlayerBox(cell, playerName) {
        var box = document.createElement("div");
        box.classList.add("player-box");
        box.textContent = playerName;

        // Create a hidden temporary element to measure the text width
        var tempElement = document.createElement("span");
        tempElement.style.visibility = "hidden";
        tempElement.style.whiteSpace = "nowrap";
        tempElement.style.font = "14px sans-serif";
        tempElement.textContent = playerName;
        document.body.appendChild(tempElement);

        // Calculate the width of the text
        var boxWidth = tempElement.offsetWidth;

        // Remove the temporary element
        document.body.removeChild(tempElement);

        var rect = cell.getBoundingClientRect();
        var offsetX = 20; // Adjust the horizontal offset as needed
        var offsetY = 20; // Adjust the vertical offset as needed

        // Calculate the box position relative to the cell
        var cellRect = cell.getBoundingClientRect();
        var boxHeight = 20; // Adjust the height as needed
        var boxTop, boxLeft;

        // Check if the box exceeds the right edge of the visible area
        if (cellRect.left + offsetX + boxWidth > window.innerWidth + window.scrollX - 20) {
            boxLeft = window.innerWidth + window.scrollX - boxWidth - 50;
        } else {
            boxLeft = cellRect.left + offsetX + window.scrollX;
        }

        // Check if the box exceeds the bottom edge of the visible area
        if (cellRect.top + offsetY + boxHeight > window.innerHeight + window.scrollY) {
            boxTop = window.innerHeight + window.scrollY - boxHeight;
        } else {
            boxTop = cellRect.top + offsetY + window.scrollY;
        }

        // Check if the box exceeds the top edge of the visible area
        if (boxTop < window.scrollY) {
            boxTop = window.scrollY;
        }

        // Check if the box exceeds the left edge of the visible area
        if (boxLeft < window.scrollX) {
            boxLeft = window.scrollX;
        }

        // Set the box position
        box.style.position = "absolute";
        box.style.top = boxTop + "px";
        box.style.left = boxLeft + "px";

        // Set the box size
        box.style.width = boxWidth + "px";
        box.style.height = boxHeight + "px";

        document.body.appendChild(box);
    }

}

function getPlayer(year, pick) {
    for (let i = 0; i < data.length; i++) {
        item = data[i];
        if (item.year == year && item.pick == pick) {
            return item;
        }
    }
    return null;
}

function getPicks(extract) {

    var statlines = extract[0];
    var logicIsAnd = extract[1];

    var validPicks = new Set();

    data.forEach(function (item) {

        if (logicIsAnd) {
            var validPick = true;
            for (let i = 0; i < statlines.length; i++) {
                statType = statlines[i].statType;
                operation = statlines[i].operation;
                value = statlines[i].value;

                if (statType === "roy" || statType === "at_col" || statType === "franchise" || statType === "college" || statType === "active") {
                    if (item[statType] && item[statType].toString().toUpperCase() != value.toString().toUpperCase()) {
                        validPick = false;
                        break;
                    }
                } else {
                    if (operation === "greater") {
                        if (parseFloat(item[statType]) <= value) {
                            validPick = false;
                            break;
                        }
                    } else if (operation === "less") {
                        if (parseFloat(item[statType]) >= value) {
                            validPick = false;
                            break;
                        }
                    } else if (operation === "equal") {
                        if (parseFloat(item[statType]) !== value) {
                            validPick = false;
                            break;
                        }
                    } else if (operation === "not_equal") {
                        if (parseFloat(item[statType]) === value) {
                            validPick = false;
                            break;
                        }
                    }
                }
            }

            if (validPick) {
                validPicks.add(JSON.stringify([parseInt(item.year), parseInt(item.pick)]));
            }

        } else {
            var validPick = false;
            for (let i = 0; i < statlines.length; i++) {
                statType = statlines[i].statType;
                operation = statlines[i].operation;
                value = statlines[i].value;

                if (statType === "roy" || statType === "at_col" || statType === "franchise" || statType === "college" || statType === "active") {
                    if (item[statType] && JSON.stringify(item[statType]).toUpperCase() == JSON.stringify(value).toUpperCase()) {
                        validPick = true;
                        break;
                    }
                } else {
                    if (operation === "greater") {
                        if (parseFloat(item[statType]) > value) {
                            validPick = true;
                            break;
                        }
                    } else if (operation === "less") {
                        if (parseFloat(item[statType]) < value) {
                            validPick = true;
                            break;
                        }
                    } else if (operation === "equal") {
                        if (parseFloat(item[statType]) === value) {
                            validPick = true;
                            break;
                        }
                    } else if (operation === "not_equal") {
                        if (parseFloat(item[statType]) !== value) {
                            validPick = true;
                            break;
                        }
                    }
                }
            }

            if (validPick) {
                validPicks.add(JSON.stringify([parseInt(item.year), parseInt(item.pick)]));
            }
        }


    });

    return validPicks
}

function updateGrid(extract) {

    data.forEach(function (item) {
        var id = JSON.stringify([parseInt(item.year), parseInt(item.pick)]);
        var cell = document.getElementById(id);
        if(cell){
            cell.style.backgroundColor = "#444";
            cell.style.border = "1px solid #000000";
        }
    });

    if(extract[0].length > 0){

        picks = getPicks(extract);

        picks.forEach(function (pick) {
            var cell = document.getElementById(pick);
            if (cell) {
                cell.style.backgroundColor = "#FFD700";
            }
        });
    }
}

function evenlySpacedArr(numElements) {
    var array = [];
    var step = 1 / (numElements - 1);

    for (var i = 0; i < numElements; i++) {
        array.push(i * step);
    }

    return array;
}

function updateGridSingleStat(stat, classMethod, numClasses) {

    var less = false;

    // Extract the values of the selected stat
    data.forEach(function (item) {
        var id = JSON.stringify([parseInt(item.year), parseInt(item.pick)]);
        var cell = document.getElementById(id);
        if(cell){
            cell.style.backgroundColor = "#444";
            cell.style.border = "1px solid #000000";
        }
    });

    if(stat === "franchise"){

        data.forEach(function (item) {
            var cell = document.getElementById(JSON.stringify([parseInt(item.year), parseInt(item.pick)]));
            if(cell && item["franchise"]){
                var cellValue = item["franchise"].toString().toLowerCase();
                cell.style.backgroundColor = teamColors[cellValue][0];
                cell.style.border = teamColors[cellValue][1];
            }
        });

    } else {

        var values = data.map(function (item) {
            if(item && item[stat]){
                return parseFloat(item[stat]);
            } else {
                return 0;
            }
        });

        // Find the number of unique values
        // If the number of unique values is less than 15, use that number for number of colors
        // In any other case, use 15 for number of colors
        var uniqueValues = [...new Set(values)];

        if (statsWithAdvancedSettings.includes(stat)) { 

            var numberOfClasses = document.getElementById("number-of-classes");
            if(uniqueValues.length < numClasses){
                numClasses = uniqueValues.length;
                numberOfClasses.value = uniqueValues.length;
            } else if(numClasses > 100){
                numClasses = 100
                numberOfClasses.value = 100;
            } else if(numClasses < 3){
                numClasses = 3
                numberOfClasses.value = 3;
            }

            var numArray = evenlySpacedArr(numClasses);

            var colorArray = [];            
            for (let i = 0; i < numClasses; i++) {
                var color = d3.interpolatePlasma(numArray[i]);
                colorArray.push(color);
            }

            var breaks = [];

            if (classMethod == "natural-breaks") {
                breaks = ss.jenks(values, numClasses);

            } else if (classMethod == "quantile") {

                values.sort(function (a, b) {
                    return a - b;
                });
                var stride = values.length / numClasses;
                for (let i = 0; i < numClasses; i++) {
                    breaks.push(values[parseInt(i * stride)])
                }
                breaks.push(values[values.length - 1]); 

                for (let i = 1; i < breaks.length - 1; i++){
                    if(breaks[i] == breaks[i-1]){
                        less = true;
                        breaks.splice(i, 1);
                        colorArray.splice(i, 1);
                        i--;
                        less = true;
                    }
                }

            } else if (classMethod == "equal-interval") {
                var min = Math.min(...values);
                var max = Math.max(...values);
                var range = max - min;
                var interval = range / numClasses;
                for (var i = 0; i <= numClasses; i++) {
                    breaks.push(min + i * interval);
                }
            }

            var breaksMask = [];
            for(var i = 0; i < breaks.length; i++){
                breaksMask.push(true);
            }

            // Iterate through the cells and assign colors based on breaks
            data.forEach(function (item) {
                var cell = document.getElementById(JSON.stringify([parseInt(item.year), parseInt(item.pick)]));
                if(cell && item[stat]){  

                    var cellValue = parseFloat(item[stat]);
                    // Find the group for the cell based on the breaks
                    var group = 0;
                    while (group < breaks.length - 1 && cellValue > breaks[group + 1]) {
                        group++;
                    }
                    // Assign color to the cell
                    var color = colorArray[group];
                    cell.style.backgroundColor = color; 
                }         
            });

        } else {

            var max = Math.max(...uniqueValues);
            var min = Math.min(...uniqueValues); 

            var breaks = [];
            var breaksMask = [];
            for(var i = min; i <= max; i++){
                if(uniqueValues.includes(i)){
                    breaksMask.push(true);
                } else {
                    breaksMask.push(false);
                }
                breaks.push(i);
            }

                        var numClasses = breaks.length;
            var numArray = evenlySpacedArr(numClasses);
            var colorArray = [];

            for (let i = 0; i < numClasses; i++) {
                var color = d3.interpolatePlasma(numArray[i]);
                colorArray.push(color);
            }

            // Iterate through the cells and assign colors based on breaks
            data.forEach(function (item) {
                var cell = document.getElementById(JSON.stringify([parseInt(item.year), parseInt(item.pick)]));
                if(cell && item[stat]){  

                    var cellValue = parseInt(item[stat]);

                    // Find the group for the cell based on the breaks
                    var group = 0;
                    for(let i = 0; i < breaks.length; i++){
                        if(cellValue === breaks[i]){
                            group = i;
                            break;
                        }
                    }

                    // Assign color to the cell
                    var color = colorArray[group];
                    cell.style.backgroundColor = color; 

                }         
            });
        }
    }
    createLegend(stat, breaks, colorArray, less, breaksMask);
}
