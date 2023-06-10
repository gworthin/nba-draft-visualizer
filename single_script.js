const statsWithAdvancedSettings = ["gms","min","pts","trb","ast","fg%","3p%","ft%","mpg","ppg","rpg","apg","ws","ws/48","bpm","vorp"];
const defaultClassNum = "10";

document.addEventListener("DOMContentLoaded", function () {
    toggleAdvancedSettingsDisable();
});


document.getElementById("single-go").addEventListener("click", function () {

    var stat = document.getElementById("single-stat-type").value;
    var classificationMethod = document.getElementById("classification-method");
    var numberOfClasses = document.getElementById("number-of-classes"); 
    var advancedSwitch = document.getElementById("advanced-switch");

    if(!advancedSwitch.checked){
        classificationMethod.value = "natural-breaks";
        numberOfClasses.value = defaultClassNum;
    }

    var classMethod = classificationMethod.value;
    var numClasses = parseInt(numberOfClasses.value);

    var legendSwitch = document.getElementById("legend-switch");
    var legend = document.getElementById("legend-container");

    updateGridSingleStat(stat, classMethod, numClasses);

    if(legendSwitch.checked){
        legend.style.visibility = "visible";
        legend.style.display = "block";
    } else{
        legend.style.display = "none";
    }

});

function toggleAdvancedSettingsVisibility() {
    var advancedOptions = document.getElementById("single-advanced-options-container");
    var advancedSwitch = document.getElementById("advanced-switch");
    var numberOfClasses = document.getElementById("number-of-classes");

    if (advancedSwitch.checked) {
        numberOfClasses.value = defaultClassNum; 
        advancedOptions.style.visibility = "visible";
    } else {
        hideAdvancedOptions();
    }
}

function toggleAdvancedSettingsDisable(){
    var advancedSwitch = document.getElementById("advanced-switch");
    var select = document.getElementById("single-stat-type");
    var text = document.getElementsByClassName("checkbox-text")[0];

    if(statsWithAdvancedSettings.includes(select.value)){
        advancedSwitch.disabled = false;
        text.style.opacity = 1;
    } else {
        advancedSwitch.checked = false;
        advancedSwitch.disabled = true;
        text.style.opacity = 0.2;
        hideAdvancedOptions();
    }
}

function hideAdvancedOptions(){    
    var advancedOptions = document.getElementById("single-advanced-options-container");
    var classificationMethod = document.getElementById("classification-method");
    var numberOfClasses = document.getElementById("number-of-classes");

    advancedOptions.style.visibility = "hidden";
    classificationMethod.value = "natural-breaks";
    numberOfClasses.value = defaultClassNum;
}

function createLegend(stat, breaks, colorArray, less, breaksMask){

    var legend = document.getElementById("legend-container");

    while (legend.firstChild) {
        legend.removeChild(legend.firstChild);
    }

    var legendTitle = document.createElement("h2");
    legendTitle.textContent = "Legend";
    legend.appendChild(legendTitle);

    var table = document.createElement("table");
    table.id = "legend-table";

    var filter = document.getElementById("filter-container");
    var maxLegendWidth = filter.clientWidth * 2;

    if(stat === "franchise") {

        var itemWidth = 8 * 4 + 35;
        var first = true;

        for (var [team, colors] of Object.entries(teamColors)) {

            if (first || currentRowWidth > maxLegendWidth - 50){
                // Create a new row for every `itemsPerRow` items
                var currentRowWidth = 0;
                var row = document.createElement("tr");
                table.appendChild(row);
                first = false;
            }

            var legendColorCell = document.createElement("td");
            var legendColor = document.createElement("span");
            legendColor.classList.add("legend-color");
            legendColor.style.backgroundColor = colors[0];
            legendColor.style.border = colors[1];
            legendColorCell.appendChild(legendColor);

            var legendLabelCell = document.createElement("td");
            var legendLabel = document.createElement("span");
            legendLabel.classList.add("legend-label");
            legendLabel.textContent = team.toUpperCase();

            currentRowWidth += itemWidth;

            legendLabelCell.appendChild(legendLabel);

            row.appendChild(legendColorCell);
            row.appendChild(legendLabelCell);

        }

        legend.appendChild(table);

    } else {

        var labels = [];

        if(statsWithAdvancedSettings.includes(stat)){

            var unit = 0.01;
            intStats = ["yrs","gms","min","pts","trb","ast","mvps","dpoys","smoys","mips","fmvps","1st_team","2nd_team","3rd_team","all_nba","all_star"];
            if(intStats.includes(stat)){
                unit = 1;
            }
    
            // Create the labels
            maxLen = 0;
            for (var i = 0; i < breaks.length - 1; i++){
                var rangeStart = roundNumber(breaks[i]);
                var rangeEnd = i === breaks.length - 2 ? roundNumber(breaks[i+1]) : roundNumber(breaks[i + 1] - unit);
                var label = "";
                if (rangeStart >= rangeEnd) {
                    label = rangeStart.toString();
                } else {
                    label = rangeStart.toString() + "  " + '\u2013' + "  " + rangeEnd.toString();
                }
                labels.push(label);
    
                maxLen = label.length > maxLen ? label.length : maxLen;
            }
    
            var itemWidth = 8 * maxLen + 20;

        } else {
            labels = breaks;
        }

        for (var i = 0; i < labels.length; i++) {

            if(breaksMask[i]){

                var label = labels[i];
                var color = colorArray[i];

                if (i === 0 || currentRowWidth > maxLegendWidth - 50){
                    // Create a new row for every `itemsPerRow` items
                    var currentRowWidth = 0;
                    var row = document.createElement("tr");
                    table.appendChild(row);
                }

                var legendColorCell = document.createElement("td");
                var legendColor = document.createElement("span");
                legendColor.classList.add("legend-color");
                legendColor.style.backgroundColor = color;
                legendColorCell.appendChild(legendColor);

                var legendLabelCell = document.createElement("td");
                var legendLabel = document.createElement("span");
                legendLabel.classList.add("legend-label");
                legendLabel.textContent = label;

                currentRowWidth += itemWidth;

                legendLabelCell.appendChild(legendLabel);

                row.appendChild(legendColorCell);
                row.appendChild(legendLabelCell);
            }
        }

        legend.appendChild(table);

        if(less){
            message = document.createElement("p");
            message.textContent = "With so many 0 values, quantiles produced fewer classes than specified";
            legend.appendChild(message);
        }

    }

}

function roundNumber(number) {
    var noDecimals = Math.floor(number * 1000);
    var noDecimalsStr = noDecimals.toString();
    if(noDecimals < 0){
        noDecimalsStr = noDecimalsStr.substring(1);
    }
    var decimalsStr = noDecimalsStr.substring(0, noDecimalsStr.length-3) + "." + noDecimalsStr.substring(noDecimalsStr.length-3);
    if(noDecimals < 0){
        decimalsStr = "-" + decimalsStr;
    }
    var final = parseFloat(decimalsStr);
    return final;
}