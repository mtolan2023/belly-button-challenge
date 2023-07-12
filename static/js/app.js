// Get the Sample Data endpoint
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// Fetch the JSON data and console log it
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

d3.json(url).then(function(data) {
    console.log(data);
    
    let names = data.names;
    let metadata = data.metadata;
    let samples = data.samples;
  
  // Create rows in panel for metadata
    var body = d3.select(".panel-body"); 
    body.append("ul");
    var list = d3.select("ul");
    var id = list.append("li");
    var eth = list.append("li"); 
    var gend = list.append("li");
    var age = list.append("li");
    var loc = list.append("li");
    var bb = list.append("li");
    var wfreq = list.append("li");

  // Build initial display
  function init() {
  
  let name = "940"
  let newSample = samples.filter(a => a.id === name);
  let newMetadata = metadata.filter(a => a.id === parseInt(name));

  console.log(newSample);
  // Populate Metadata Table
  let metaID = newMetadata[0]["id"];
  let metaEth = newMetadata[0]["ethnicity"];
  let metaGender = newMetadata[0]["gender"];
  let metaAge = newMetadata[0]["age"];
  let metaLoc = newMetadata[0]["location"];
  let metaBB = newMetadata[0]["bbtype"];
  let metawfreq = newMetadata[0]["wfreq"];

  id.text(`ID:  ${metaID}`);
  eth.text(`Ethnicity:  ${metaEth}`); 
  gend.text(`Gender:  ${metaGender}`);
  age.text(`Age:  ${metaAge}`);
  loc.text(`Location:  ${metaLoc}`)
  bb.text(`BB Type:  ${metaBB}`);
  wfreq.text(`W freq:  ${metawfreq}`);

  ids = newSample[0]["otu_ids"];
  console.log("ids", ids);

  // Bubble plot
  let trace2 = {
    x: newSample[0]["otu_ids"],
    y: newSample[0]["sample_values"],
    text: newSample[0]["otu_labels"],
    mode: 'markers',
    marker: {
      color: newSample[0]["otu_ids"],
      // colorscale: [[0, 'rgb(0,0,139)'], [1, 'rgb(210,180,140)']],
      size: newSample[0]["sample_values"]
      }
    };

  let bubbleLayout = {
      xaxis: {
      title: {
        text: "OTU ID"
        }
      }
    };

  let bubbleData = [trace2];
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  

  // Sample bar chart

  sampleData = newSample[0]["sample_values"];
  // console.log(sampleData)
  
  // Merge Arrays into list of dictionaries for sorting/slicing
  let sampleCombined = []
  for (let i = 0;  i < sampleData.length; i++) {
    sampleCombined.push({
      "sample_values" : newSample[0]["sample_values"][i],
      "otu_ids": newSample[0]["otu_ids"][i],
      "otu_labels": newSample[0]["otu_labels"][i]
    });  
  }
  // Sort by sample_values(descending)
  let sampleSort = sampleCombined.sort((a, b) => b.sample_values - a.sample_values);
  console.log("Sample Sort", sampleSort)

  // Slice to limit to top 10
  let sampleTopTen = sampleSort.slice(0, 10);
  console.log("Sample Top Ten", sampleTopTen)


  // Reverse for plotting
  let samplePlot = sampleTopTen.reverse();
  console.log("Reversed for Plot". samplePlot);


  // Build Bar Chart
    let trace1 = {
      x: samplePlot.map(obj => obj.sample_values),
      y: samplePlot.map(obj => 'OTU' + obj.otu_ids),
      text: samplePlot.map(obj => obj.otu_labels),
      type: "bar",
      orientation: "h"
    };

    let traceData = [trace1];

    Plotly.newPlot("bar", traceData);
  
  };   
  // DOM functions to pull dropdown and update charts
  // https://stackoverflow.com/questions/43121679/how-to-append-option-into-select-combo-box-in-d3
    let selector = d3.select("#selDataset");
    let sampleNames = names;
            
    sampleNames.forEach((sample) => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
    });    

// Call updatePlotly() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", updatePlotly);

// This function is called when a dropdown menu item is selected
function updatePlotly() {
  // Use D3 to select the dropdown menu
  let dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  let name = dropdownMenu.property("value");
  console.log(name);

  // Find new sample by id in JSON
  // https://stackoverflow.com/questions/55836129/return-json-object-by-value-of-a-key
  let newSample = samples.filter(a => a.id === name);
  let newMetadata = metadata.filter(a => a.id === parseInt(name));

  console.log(newSample);
  console.log(newMetadata);

  let metaID = newMetadata[0]["id"];
  let metaEth = newMetadata[0]["ethnicity"];
  let metaGender = newMetadata[0]["gender"];
  let metaAge = newMetadata[0]["age"];
  let metaLoc = newMetadata[0]["location"];
  let metaBB = newMetadata[0]["bbtype"];
  let metawfreq = newMetadata[0]["wfreq"];

  // New Data for metadata
  id.text(`ID:  ${metaID}`);
  eth.text(`Ethnicity:  ${metaEth}`); 
  gend.text(`Gender:  ${metaGender}`);
  age.text(`Age:  ${metaAge}`);
  loc.text(`Location:  ${metaLoc}`)
  bb.text(`BB Type:  ${metaBB}`);
  wfreq.text(`W freq:  ${metawfreq}`);


  // New Data for Bubble
  let data = {
    x: newSample[0]["otu_ids"],
    y: newSample[0]["sample_values"],
    text: newSample[0]["otu_labels"],
    mode: 'markers',
    marker: {
      color: newSample[0]["otu_ids"],
      size: newSample[0]["sample_values"]
      }
    };
    
    let bubbleLayout = {
      xaxis: {
      title: {
        text: "OTU ID"
      }
      }
      };



  let newData = [data];

  Plotly.newPlot("bubble", newData, bubbleLayout)
  
    // Sample bar chart

    sampleData = newSample[0]["sample_values"];
    // console.log(sampleData)
    
    // Merge Arrays into list of dictionaries for sorting/slicing
    let sampleCombined = []
    for (let i = 0;  i < sampleData.length; i++) {
      sampleCombined.push({
        "sample_values" : newSample[0]["sample_values"][i],
        "otu_ids": newSample[0]["otu_ids"][i],
        "otu_labels": newSample[0]["otu_labels"][i]
      });  
    }
    // Sort by sample_values(descending)
    let sampleSort = sampleCombined.sort((a, b) => b.sample_values - a.sample_values);
    console.log("Sample Sort", sampleSort)
  
    // Slice to limit to top 10
    let sampleTopTen = sampleSort.slice(0, 10);
    console.log("Sample Top Ten", sampleTopTen)
  
  
    // Reverse for plotting
    let samplePlot = sampleTopTen.reverse();
    console.log("Reversed for Plot". samplePlot);
  
  
    // Build Bar Chart
      let trace1 = {
        x: samplePlot.map(obj => obj.sample_values),
        y: samplePlot.map(obj => 'OTU' + obj.otu_ids),
        text: samplePlot.map(obj => obj.otu_labels),
        type: "bar",
        orientation: "h"
      };
  
      let traceData = [trace1];
  
      Plotly.newPlot("bar", traceData);


};
    
init();

});