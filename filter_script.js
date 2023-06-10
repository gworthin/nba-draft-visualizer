// Maximum number of stat lines allowed
const maxStats = 5;

// Create the first default stat line on load
document.addEventListener("DOMContentLoaded", function () {
    addStatLine();
    updateAll();
});

// Add a new stat line when the add a stat button is clicked
document.getElementById("add-stat").addEventListener("click", function () {
    var statLines = document.getElementsByClassName("stat-line");
    if (statLines.length < maxStats) {
        addStatLine();
    }
});

// Delete a stat line when a delete button is clicked
document.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("delete-stat")) {
        if (event.target.disabled) {
            return;
        }
        deleteStatLine(event.target);
        updateAll();
    }
});

// Update the draft pick grid based on the filter conditions when the user clicks Go!
document.getElementById("filter-go").addEventListener("click", function () {
    var extract = extractStatLines();
    updateGrid(extract);

    var legend = document.getElementById("legend-container");
    if(legend){
        legend.style.display = "none";
    }
});

// Create and add a new stat line
function addStatLine() {
    var statInputs = document.getElementById("filter-stat-lines-container");
    var newInput = document.createElement("div");
    newInput.innerHTML = `
    <div class="stat-line">
        <div class="stat-type-container">
            <select class="stat-type" id="filter-stat-type" onchange="handleStatTypeChange(this)">
                <optgroup label="Career Totals">
                    <option value="yrs">Years Played</option>
                    <option value="gms">Games Played</option>
                    <option value="min">Minutes Played</option>                        
                    <option value="pts">Total Points</option>
                    <option value="trb">Total Rebounds</option>
                    <option value="ast">Total Assists</option>
                    <option value="fg%">Career FG% (input as a decimal)</option>
                    <option value="3p%">Career 3P% (input as a decimal)</option>
                    <option value="ft%">Career FT% (input as a decimal)</option>
                </optgroup>
                <optgroup label="Per Game Stats">
                    <option value="mpg">Minutes per Game</option>
                    <option value="ppg">Points per Game</option>
                    <option value="rpg">Rebounds per Game</option>
                    <option value="apg">Assists per Game</option>
                </optgroup>
                <optgroup label="Advanced Stats">
                    <option value="ws">Win Shares</option>
                    <option value="ws/48">Win Shares / 48</option>
                    <option value="bpm">Box +/-</option>
                    <option value="vorp">VORP</option>
                </optgroup>
                <optgroup label="Accolades">
                    <option value="mvps">MVPs</option>
                    <option value="roy">ROY</option>
                    <option value="dpoys">DPOYs</option>
                    <option value="smoys">6MOYs</option>
                    <option value="mips">MIPs</option>
                    <option value="fmvps">Finals MVPs</option>
                    <option value="1st_team">All-NBA 1st Teams</option>
                    <option value="2nd_team">All-NBA 2nd Teams</option>
                    <option value="3rd_team">All-NBA 3rd Teams</option>
                    <option value="all_nba">Total All-NBA Teams</option>
                    <option value="all_star">All-Star Selections</option>
                </optgroup>
                <optgroup label="Misc">
                    <option value="franchise">Team</option>
                    <option value="college">College</option>
                    <option value="active">Active</option>
                    <option value="at_col">Attended College</option>
                </optgroup>
            </select>
        </div>
        <span class="operation-and-value">
            <select class="operation">
                <option value="greater">&gt;</option>
                <option value="less">&lt;</option>
                <option value="equal">=</option>
                <option value="not_equal">&#8800;</option>
            </select>
            <input type="number" class="num-input">
        </span>
        <span class="bool-value">
            <label for="bool-select">=</label>
            <select class="bool-select" id="bool-select">
                <option value="true">True</option>
                <option value="false">False</option>
            </select>
        </span>
        <span class="team-value">
            <label for="team-select">=</label>
            <select class="team-select" id="team-select">
                <option value="atl">ATL</option>
                <option value="bos">BOS</option>
                <option value="brk">BRK</option>
                <option value="chi">CHI</option>
                <option value="cho">CHO</option>
                <option value="cle">CLE</option>
                <option value="dal">DAL</option>
                <option value="den">DEN</option>
                <option value="det">DET</option>
                <option value="gsw">GSW</option>
                <option value="hou">HOU</option>
                <option value="ind">IND</option>
                <option value="lac">LAC</option>
                <option value="lal">LAL</option>
                <option value="mem">MEM</option>
                <option value="mia">MIA</option>
                <option value="mil">MIL</option>
                <option value="min">MIN</option>
                <option value="nop">NOP</option>
                <option value="nyk">NYK</option>
                <option value="okc">OKC</option>
                <option value="orl">ORL</option>
                <option value="phi">PHI</option>
                <option value="pho">PHO</option>
                <option value="por">POR</option>
                <option value="sac">SAC</option>
                <option value="sas">SAS</option>
                <option value="tor">TOR</option>
                <option value="uta">UTA</option>
                <option value="was">WAS</option>
            </select>
        </span>
        <span class="college-value">
            <label for="college-select">=</label>
            <select class="college-select" id="college-select"></select>
        </span>
        <button class="delete-stat">Delete</button>
    </div>
    `;
    statInputs.appendChild(newInput);
    handleStatTypeChange(newInput.querySelector('.stat-type'));
    updateAll();
}

// Delete a stat line
function deleteStatLine(button) {
    var statLine = button.parentNode;
    statLine.remove();
    updateAll();
}

// Update which delete buttons are enabled based on the number of stat lines
function updateDeleteButtons() {
    var deleteButtons = document.getElementsByClassName("delete-stat");
    if (deleteButtons.length === 1) {
        for (var i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].disabled = true;
        }
    } else {
        for (var i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].disabled = false;
        }
    }
}

// Update whether the add button is enabled based on the number of stat lines
function updateAddButton() {
    var addButton = document.getElementById("add-stat");
    var statLines = document.getElementsByClassName("stat-line");
    if (statLines.length < maxStats) {
        addButton.disabled = false;
    } else {
        addButton.disabled = true;
    }
}

// Update whether the logic select is visible based on the number of stat lines
function updateLogicSelect() {
    var logicContainer = document.getElementById("filter-logic-container");
    var logic = document.getElementById("logic");
    var statLines = document.getElementsByClassName("stat-line");
    if (statLines.length === 1) {
        logicContainer.style.visibility = "hidden";
        logic.value = "and";
    } else {
        logicContainer.style.visibility = "visible"; 
    }
}

// Call all three update functions 
function updateAll() {
    updateDeleteButtons();
    updateAddButton();
    updateLogicSelect();
}

// Change the contents of the stat line depending on the selected stat type
function handleStatTypeChange(select) {
    var parentDiv = select.parentNode.parentNode;
    var operationAndValue = parentDiv.getElementsByClassName("operation-and-value")[0];
    var boolValue = parentDiv.getElementsByClassName("bool-value")[0];
    var teamValue = parentDiv.getElementsByClassName("team-value")[0];
    var collegeValue = parentDiv.getElementsByClassName("college-value")[0];

    if (select.value === "roy" || select.value === "at_col" || select.value === "active") {
        operationAndValue.style.display = "none";
        boolValue.style.display = "inline-block";
        teamValue.style.display = "none";
        collegeValue.style.display = "none";
    } else if (select.value === "franchise") {
        operationAndValue.style.display = "none";
        boolValue.style.display = "none";
        teamValue.style.display = "inline-block";
        collegeValue.style.display = "none";
    } else if (select.value == "college"){
        makeCollegeSelect();
        operationAndValue.style.display = "none";
        boolValue.style.display = "none";
        teamValue.style.display = "none";
        collegeValue.style.display = "inline-block"; 
    }else {
        operationAndValue.style.display = "inline-block";
        boolValue.style.display = "none";
        teamValue.style.display = "none"; 
        collegeValue.style.display = "none";

    }
    updateAll();
}

// Dynamically create the college select item based on the unique colleges in the dataset
function makeCollegeSelect(){
    if(data){
        var collegeSelects = document.getElementsByClassName("college-select");

        for(let i = 0; i < collegeSelects.length; i++){

            var collegeSelect = collegeSelects[i];

            var colleges = data.map(function (item) {
                if(item && item["college"]){
                    return item["college"].toString();
                } else {
                    return "";
                }
            });
            var uniqueColleges = [...new Set(colleges)];

            const idx1 = uniqueColleges.indexOf("");
            if (idx1 > -1) { 
                uniqueColleges.splice(idx1, 1); 
            } 
            
            const idx2 = uniqueColleges.indexOf("-");
            if (idx2 > -1) { 
                uniqueColleges.splice(idx2, 1); 
            } 
            
            uniqueColleges.sort();

            for(let i = 0; i < uniqueColleges.length; i++){
                var option = document.createElement("option");
                option.value = uniqueColleges[i];
                option.textContent = uniqueColleges[i];
                collegeSelect.appendChild(option);
            }
        }
    }
}

// Extract the current stat line conditions and put them into a list
function extractStatLines() {
    var statLines = document.getElementsByClassName("stat-line");
    var extractedStats = [];

    // Extract logical operator
    var logicIsAnd = false;
    var logicSelect = document.getElementById("logic");
    if (logicSelect.value === "and") {
        logicIsAnd = true;
    }

    // Iterate through each stat line
    for (var i = 0; i < statLines.length; i++) {
        var statLine = statLines[i];
        var statType = statLine.getElementsByClassName("stat-type")[0].value;

        var validStat = true;
        // If we are extracting a boolean falue
        if (statType === "roy" || statType === "at_col" || statType === "active") {
            var boolValue = statLine.getElementsByClassName("bool-select")[0].value;

            var stat = {
                statType: statType,
                operation: "equal",
                value: boolValue,
            };

        } else if (statType === "franchise"){
            var teamValue = statLine.getElementsByClassName("team-select")[0].value;
        
            var stat = {
                statType: statType,
                operation: "equal",
                value: teamValue,
            };

        } else if (statType === "college"){
            var collegeValue = statLine.getElementsByClassName("college-select")[0].value;
            
            var stat = {
                statType: "college",
                operation: "equal",
                value: collegeValue,
            };

        // If we are extracting a numerical value
        }else {
            var operation = statLine.getElementsByClassName("operation")[0].value;
            var value = parseFloat(statLine.getElementsByClassName("num-input")[0].value);

            if (isNaN(value)) {
                validStat = false;
            } else {
                var stat = {
                    statType: statType,
                    operation: operation,
                    value: value,
                };
            }

        }

        if(validStat){
            extractedStats.push(stat);
        }

    }

    return [extractedStats, logicIsAnd];
}