const commaFormatter = d3.format(",");
const percentFormatter = d3.format("%");

const wrapXAxis = (text, width) => {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.5, // ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", dy + "em");
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
};

//data for the blog

const essentialIndustries = [
  { label: "Essential Industries" },
  {
    key: "East Flatbush",
    value: 33,
  },
  {
    key: "Williamsbridge",
    value: 32,
  },
  {
    key: "Canarsie",
    value: 32,
  },
  {
    key: "University Heights",
    value: 31,
  },
  {
    key: "Unionport/Soundview",
    value: 30,
  },
  {
    key: "New York City",
    value: 22,
  },
];

const faceToFaceIndustries = [
  { label: "Face-to-Face Industries" },
  {
    key: "Elmhurst/Corona",
    value: 67,
  },
  {
    key: "Jackson Heights",
    value: 66,
  },
  {
    key: "Mott Haven & Hunts Point",
    value: 57,
  },
  {
    key: "Bedford Park",
    value: 57,
  },
  {
    key: "Woodhaven",
    value: 57,
  },
  {
    key: "New York City",
    value: 46,
  },
];

const industryImmigration_construction = [
  { key: "US-born", value: 36 },
  { key: "Naturalized citizen", value: 23 },
  { key: "Non-citizen", value: 41 },
];

const industryImmigration_resturant = [
  { key: "US-born", value: 42 },
  { key: "Naturalized citizen", value: 22 },
  { key: "Non-citizen", value: 36 },
];

const industryImmigration_food = [
  { key: "US-born", value: 41 },
  { key: "Naturalized citizen", value: 25 },
  { key: "Non-citizen", value: 34 },
];

const industryImmigration_personal = [
  { key: "US-born", value: 42 },
  { key: "Naturalized citizen", value: 26 },
  { key: "Non-citizen", value: 32 },
];

const industryImmigration_foodRetail = [
  { key: "US-born", value: 47 },
  { key: "Naturalized citizen", value: 24 },
  { key: "Non-citizen", value: 29 },
];

const industryImmigration_all = [
  { key: "US-born", value: 55 },
  { key: "Naturalized citizen", value: 25 },
  { key: "Non-citizen", value: 20 },
];

//bar chart function

const createHorizontalBarChart = () => {
  const colors = ["#ff6633"];

  // bar chart settings
  const width = 400;
  const height = 200;
  const margin = { left: 150, right: 50, top: 10, bottom: 10 };

  const svg = d3
    .select(`#essential-industries svg`)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  //xscale

  const createChart = (data, transX) => {
    let trimmedData = data.filter((el) => el.key !== undefined);

    xScale = d3
      .scaleLinear()
      .range([0, width / 2])
      .domain([0,67]);

    //yscale
    yScale = d3
      .scaleBand()
      .range([0, height])
      .domain(
        trimmedData.map((d) => {
          return d.key;
        })
      )
      .padding(0.1);

    const bars = svg
      .append("g")
      .attr("class", "group")
      .attr("transform", `translate(0,0)`)
      .selectAll("rect")
      .data(trimmedData)
      .enter()
      .append("rect")
      .attr("class", "bars")
      .attr("y", (d) => {
        return yScale(d.key) + 25;
      })
      .attr("x", (d) => transX)
      .attr("height", (d) => {
        return yScale.bandwidth() / 3;
      })
      .attr("width", (d) => {
        return xScale(d.value);
      })
      .attr("data-neighborhood", (d) => d.key)
      .attr("fill", (d) => {
        if (d.key === "New York City") {
          return "lightgray";
        } else {
          return colors[0];
        }
      });

    const labels = svg
      .append("g")
      .selectAll("text")
      .data(trimmedData)
      .enter()
      .append("text")
      .text((d) => {
        return d.value + "%";
      })
      .attr("x", (d) => xScale(d.value) + transX)
      .attr("dx", "2em")
      .attr("y", (d) => {
        return yScale(d.key) + yScale.bandwidth() + margin.top-5;
      })
      .attr("text-anchor", "center");

    const neighborhoodLabels = svg
      .append("g")
      .selectAll("text")
      .data(trimmedData)
      .enter()
      .append("text")
      .text((d) => {
        return d.key;
      })
      .attr("x", transX -20)
      .attr("dx", "1.5em")
      .attr("y", (d) => {
        return yScale(d.key) + yScale.bandwidth()/2 +2;
      })
      .attr("text-anchor", "start");
  };

  createChart(essentialIndustries, 0);
  createChart(faceToFaceIndustries, width - 90);
};

createHorizontalBarChart();



// horizontal stacked bar chart

const createChartIndustryByImmigration = ()=>{
  const colors = ["#e5e5e5", "#7fcde2", "#0099cd"];
  colors.reverse()

const createStackedChart = (data, id) => {
  const dataSum = d3.sum(data, (d) => {
    return d.value;
  });

  const width = 400,
    height = 30;

  const xScale = d3.scaleLinear().range([0, width]).domain([0, dataSum]);
  xBand = d3
    .scaleBand()
    .range([0, width])
    .domain(
      data.map((d) => {
        return d.value;
      })
    );

  let offset = 0;
  data.forEach((d) => {
    d.offset = offset;
    offset = offset + d.value;
  });

  const svg = d3
    .select(`#${id} svg`)
    .attr("width", width)
    .attr("height", height);

  //bars
  svg
    .append("g")
    .attr("class", `${id}-bars`)
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", (d) => {
      return 0;
    })
    .attr("height", (d) => {
      return height;
    })
    .style("width", (d) => {
      return xScale(d.value) + "px";
    })
    .attr("x", (d) => {
      return xScale(d.offset);
    })
    .attr("fill", (d, i) => colors[i]);

  //labels

  svg
    .append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text((d) => {
      return d.value + "%";
    })
    .attr("x", (d) => {
      return xScale(d.offset) + xBand.bandwidth() / 3;
    })
    .attr("dx", "1.3em")
    .attr("y", (d) => height / 1.8)
    .attr("text-anchor", "middle")
    .attr("fill", "black");
};

createStackedChart(industryImmigration_construction, "construction");
createStackedChart(industryImmigration_resturant, "restaurant");
createStackedChart(industryImmigration_food, "food");
createStackedChart(industryImmigration_personal, "personal");
createStackedChart(industryImmigration_foodRetail, "food-retail");
createStackedChart(industryImmigration_all, "all");

let industryLabels = ["Construction",
"Restaurants and Hospitality",
"Food/Drug/Beverage Manufacturing",
"Personal/Other Services",
"Food/Drug/Beverage Retail",
"All workers aged 16+"]

let industryLabelHolder = document.querySelectorAll('#industry-immigration-status .container span')
for (let i =0;i<industryLabelHolder.length;i++){
industryLabelHolder[i].textContent = industryLabels[i]
}

let legendIcons = document.querySelectorAll('#industry-immigration-status .legend-wrapper i')
for (let i =0;i<legendIcons.length;i++){
  legendIcons[i].style.backgroundColor = colors[i];
}

}

createChartIndustryByImmigration()



// share of workers by industry data

const shareWorkers_arts = [
  { label: "Arts, Entertainment, Recreation" },
  { key: "Asian", value: 8 },
  { key: "Black", value: 17 },
  { key: "Latino", value: 19 },
  { key: "White", value: 54 },
];

const shareWorkers_childcare = [
  { label: "Childcare Services" },
  { key: "Asian", value: 9 },
  { key: "Black", value: 29 },
  { key: "Latino", value: 41 },
  { key: "White", value: 17 },
];

const shareWorkers_transportation = [
  { label: "Transportation and Warehousing" },
  { key: "Asian", value: 18 },
  { key: "Black", value: 33 },
  { key: "Latino", value: 28 },
  { key: "White", value: 19 },
];

const shareWorkers_restaurant = [
  { label: "Restaurants and Hospitality" },
  { key: "Asian", value: 23 },
  { key: "Black", value: 14 },
  { key: "Latino", value: 40 },
  { key: "White", value: 21 },
];

const shareWorkers_population = [
  { label: "Share of the Working Age Population (16+)" },
  { key: "Asian", value: 15 },
  { key: "Black", value: 22 },
  { key: "Latino", value: 28 },
  { key: "White", value: 33 },
];

//setting up groupedCharts

const createGroupedChart_race = (id) => {
  const colors = ["#ff6633", "#ffcccc", "#3366cc", "#6699cc"];
  const width = 550,
    height = 220;
  const margin = { left: 0, right: 150, top: 50, bottom: 50 };

  const xScale = d3
    .scaleBand()
    .range([0, width / 6])
    .domain(shareWorkers_arts.map((d) => d.key))
    .padding(0.1);

  const yScale = d3.scaleLinear().range([height, 0]).domain([0, 60]);

  let svg = d3
    .select(`#${id} svg`)
    .attr("width", width + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  //y-axis
  svg
    .append("g")
    .attr("class", "y-axis")
    .call(
      d3
        .axisRight(yScale)
        .tickFormat((d) => d + "%")
        .tickSize([width + margin.right - 35])
        .ticks(5)
    )
    .attr("transform", `translate(0,${margin.top})`);
  d3.selectAll(".y-axis .domain").style("visibility", "hidden");
  d3.selectAll(".y-axis .tick line").attr("stroke", "gainsboro");

  const createCharts = (data, transX, id) => {
    let trimmedData = data.filter((el) => el.key !== undefined);
    let svg = d3.select(`#${id} svg`);
    svg
      .append("g")
      .attr("class", "group")
      .attr("width", width / 8)
      .attr("transform", `translate(${transX},${margin.top})`)
      .selectAll("rect")
      .data(trimmedData)
      .enter()
      .append("rect")
      .attr("x", (d) => {
        return xScale(d.key);
      })
      .attr("width", (d) => {
        return xScale.bandwidth();
      })
      .attr("y", (d) => {
        return yScale(d.value);
      })
      .attr("height", (d) => height - yScale(d.value) + "px")
      .attr("fill", (d, i) => colors[i]);

    svg
      .append("g")
      .attr("class", "label-group")
      .attr("width", width / 8)
      .attr("transform", `translate(${transX},${margin.top})`)
      .selectAll("text")
      .data(trimmedData)
      .enter()
      .append("text")
      .text((d) => {
        return d.value + "%";
      })
      .attr("x", (d) => {
        return xScale(d.key);
      })
      .attr("y", (d) => {
        return yScale(d.value);
      })
      .attr("dy", "-.5em")
      .style("font-size", "10px");

    //overall group labels
    svg
      .append("g")
      .attr("class", "overall-label-group")
      .attr("width", width / 8)
      .attr(
        "transform",
        `translate(${transX + 60},${height + margin.top + 20})`
      )
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text((d) => {
        return d.label;
      })
      .attr("x", (d) => {
        return xScale(d.key);
      })
      .attr("y", (d) => {
        return yScale(d.value);
      })
      .attr("dy", "-.5em")
      .attr('text-anchor','middle')
      .style("font-size", "12px")
      .call(wrapXAxis, xScale.bandwidth() + 100);
  };
  //run the functions for the graphs for race of workers by industry
  createCharts(shareWorkers_arts, 0, "share-of-workers");
  createCharts(shareWorkers_childcare, width / 4, "share-of-workers");
  createCharts(shareWorkers_transportation, width / 2, "share-of-workers");
  createCharts(
    shareWorkers_restaurant,
    width - margin.right,
    "share-of-workers"
  );

  const createStackedDotChart = (data) => {
    let trimmedData = data.filter((el) => el.key !== undefined);
    svg
      .append("g")
      .attr("class", "dots")
      .selectAll("circle")
      .data(trimmedData)
      .enter()
      .append("circle")
      .attr("cx", width + xScale.bandwidth())
      .attr("r", 10)
      .attr("cy", (d) => {
        return yScale(d.value);
      })
      .attr("transform", `translate(0,${margin.top})`)
      .attr("fill", (d, i) => colors[i]);
    svg
      .append("g")
      .attr("class", "dot-labels")
      .selectAll("text")
      .data(trimmedData)
      .enter()
      .append("text")
      .text((d) => d.key)
      .attr("x", width + xScale.bandwidth())
      .attr("dx", "1.5em")
      .attr("y", (d) => {
        return yScale(d.value);
      })
      .attr("dy", 5)
      .attr("transform", `translate(0,${margin.top})`)
      .style("font-size", "10px")
      .attr("text-anchor", "top");

    //overall group labels
    svg
      .append("g")
      .attr("class", "overall-label-group")
      .attr("width", width / 8)
      .attr(
        "transform",
        `translate(${margin.right + width / 1.45},${
          height + margin.bottom + 20
        })`
      )
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text((d) => {
        return d.label;
      })
      .attr("x", (d) => {
        return xScale(d.key);
      })
      .attr("y", (d) => {
        return yScale(d.value);
      })
      .attr("dy", "-.5em")
      .style("font-size", "12px")
      .call(wrapXAxis, xScale.bandwidth() + 100);
  };
  createStackedDotChart(shareWorkers_population);

  let legendIcon = document.querySelectorAll('#share-of-workers .legend-wrapper i')
  for (let i =0;i<legendIcon.length;i++){
    legendIcon[i].style.backgroundColor = colors[i]
  }

  // end of function
};

createGroupedChart_race("share-of-workers");

//share of workers by age

const ageWorkers_restaurant = [
  { label: "Restaurants and Hospitality" },
  { key: "Teens (16-19 years)", value: 24 },
  { key: "Young Adults (20-24 years)", value: 15 },
  { key: "Adults (25+ years)", value: 7 },
];

const ageWorkers_nonessential = [
  { label: "Nonessential Retail" },
  { key: "Teens (16-19 years)", value: 15 },
  { key: "Young Adults (20-24 years)", value: 14 },
  { key: "Adults (25+ years)", value: 6 },
];

const ageWorkers_arts = [
  { label: "Arts, Entertainment, Recreation" },
  { key: "Teens (16-19 years)", value: 8 },
  { key: "Young Adults (20-24 years)", value: 8 },
  { key: "Adults (25+ years)", value: 3 },
];

const ageWorkers_foodRetail = [
  { label: "Food/Drug/Beverage Retail" },
  { key: "Teens (16-19 years)", value: 7 },
  { key: "Young Adults (20-24 years)", value: 6 },
  { key: "Adults (25+ years)", value: 3 },
];

//start of function to create the second grouped charts

const createGroupedChart_age = (id) => {
  const colors = ["#ff6633", "#ffcccc", "#3366cc", "#6699cc"];
  const width = 660,
    height = 200;
  const margin = { left: 0, right: 0, top: 50, bottom: 50 };

  const xScale = d3
    .scaleBand()
    .range([0, width / 4])
    .domain(ageWorkers_arts.map((d) => d.key))
    .padding(0.1);

  const yScale = d3.scaleLinear().range([height, 0]).domain([0, 25]);

  let svg = d3
    .select(`#${id} svg`)
    .attr("width", width)
    .attr("height", height + margin.top + margin.bottom);

  const createCharts = (data, transX, id) => {
    let trimmedData = data.filter((el) => el.key !== undefined);
    let svg = d3.select(`#${id} svg`);
    svg
      .append("g")
      .attr("class", "group")
      .attr("width", width / 4)
      .attr("transform", `translate(${transX},${margin.top})`)
      .selectAll("rect")
      .data(trimmedData)
      .enter()
      .append("rect")
      .attr("x", (d) => {
        return xScale(d.key);
      })
      .attr("width", (d) => {
        return xScale.bandwidth();
      })
      .attr("y", (d) => {
        return yScale(d.value);
      })
      .attr("height", (d) => height - yScale(d.value) + "px")
      .attr("fill", (d, i) => colors[i]);

    //data labels

    svg
      .append("g")
      .attr("class", "label-group")
      .attr("width", width / 4)
      .attr("transform", `translate(${transX + xScale.bandwidth()-20},${margin.top})`)
      .selectAll("text")
      .data(trimmedData)
      .enter()
      .append("text")
      .text((d) => {
        return d.value + "%";
      })
      .attr("x", (d) => {
        return xScale(d.key);
      })
      .attr("y", (d) => {
        return yScale(d.value);
      })
      .attr("dy", "-.5em")
      .style("font-size", "14px")
      .attr('text-anchor','middle');

    //overall group labels
    svg
      .append("g")
      .attr("class", "overall-label-group")
      .attr("width", width / 4)
      .attr(
        "transform",
        `translate(${transX + 100},${height + margin.bottom + 20})`
      )
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text((d) => {
        return d.label;
      })
      .attr("x", (d) => {
        return xScale(d.key);
      })
      .attr("y", (d) => {
        return yScale(d.value);
      })
      .attr("dy", "-.5em")
      .style("font-size", "12px")
      .attr('text-anchor','middle')
      .call(wrapXAxis, xScale.bandwidth() + 120);
  };
  //run the functions for the graphs for race of workers by industry
  createCharts(ageWorkers_restaurant, -20, "share-of-age");
  createCharts(ageWorkers_nonessential, 155, "share-of-age");
  createCharts(ageWorkers_arts, 155 * 2, "share-of-age");
  createCharts(ageWorkers_foodRetail, 155 * 3, "share-of-age");

  let legendIcon = document.querySelectorAll('#share-of-age .legend-wrapper i')
  for (let i =0;i<legendIcon.length;i++){
    legendIcon[i].style.backgroundColor = colors[i]
  }
  // end of function
};

createGroupedChart_age("share-of-age");

//data for works with children at home

const workingParents_healthcare = [
  { key: "With young children (<5 yrs)", value: 32948 },
  { key: "With school aged children (5 to 17 yrs)", value: 104382 },
  { key: "With young + school children (<5 and 5 to 17 yrs)", value: 38456 },
  { key: "Total", value: 175786 },
];

const workingParents_foodRetail = [
  { key: "With young children (<5 yrs)", value: 8755 },
  { key: "With school aged children (5 to 17 yrs)", value: 27341 },
  { key: "With young + school children (<5 and 5 to 17 yrs)", value: 11973 },
  { key: "Total", value: 48070 },
];

const workingParents_restaurants = [
  { key: "With young children (<5 yrs)", value: 21545 },
  { key: "With school aged children (5 to 17 yrs)", value: 67853 },
  { key: "With young + school children (<5 and 5 to 17 yrs)", value: 28177 },
  { key: "Total", value: 117576 },
];

const workingParents_transportation = [
  { key: "With young children (<5 yrs)", value: 12179 },
  { key: "With school aged children (5 to 17 yrs)", value: 41724 },
  { key: "With young + school children (<5 and 5 to 17 yrs)", value: 14075 },
  { key: "Total", value: 67977 },
];

const workingParents_personal = [
  { key: "With young children (<5 yrs)", value: 11634 },
  { key: "With school aged children (5 to 17 yrs)", value: 40798 },
  { key: "With young + school children (<5 and 5 to 17 yrs)", value: 16434 },
  { key: "Total", value: 68865 },
];

const workingParents_nonessential = [
  { key: "With young children (<5 yrs)", value: 14019 },
  { key: "With school aged children (5 to 17 yrs)", value: 39629 },
  { key: "With young + school children (<5 and 5 to 17 yrs)", value: 14671 },
  { key: "Total", value: 68318 },
];

const workingParents_construction = [
  { key: "With young children (<5 yrs)", value: 13338 },
  { key: "With school aged children (5 to 17 yrs)", value: 34590 },
  { key: "With young + school children (<5 and 5 to 17 yrs)", value: 17282 },
  { key: "Total", value: 65209 },
];

const workingParents_admin = [
  { key: "With young children (<5 yrs)", value: 8941 },
  { key: "With school aged children (5 to 17 yrs)", value: 30067 },
  { key: "With young + school children (<5 and 5 to 17 yrs)", value: 9603 },
  { key: "Total", value: 48611 },
];

const workingParents_education = [
  { key: "With young children (<5 yrs)", value: 18894 },
  { key: "With school aged children (5 to 17 yrs)", value: 38125 },
  { key: "With young + school children (<5 and 5 to 17 yrs)", value: 15427 },
  { key: "Total", value: 72446 },
];

const workingParents_finance = [
  { key: "With young children (<5 yrs)", value: 18841 },
  { key: "With school aged children (5 to 17 yrs)", value: 31409 },
  { key: "With young + school children (<5 and 5 to 17 yrs)", value: 10390 },
  { key: "Total", value: 60640 },
];

const createWorkingParentsChart = () => {
  const colors = ["#ff6633", "#ffcccc", "#0099cd"];

  const createStackedChart = (data, id) => {
    const trimmedData = data.filter((el) => el.key !== "Total");

    const width = 300,
      height = 20;
    const margin = { left: 100, right: 100 };

    const xScale = d3.scaleLinear().range([0, width]).domain([0, 200000]);
    xBand = d3
      .scaleBand()
      .range([0, width])
      .domain(
        data.map((d) => {
          return d.value;
        })
      );

    let offset = 0;
    data.forEach((d) => {
      d.offset = offset;
      offset = offset + d.value;
    });

    const svg = d3
      .select(`.industry-container div #${id}`)
      .attr("width", width + margin.right + margin.left)
      .attr("height", height);

    //bars
    svg
      .append("g")
      .attr("class", `${id}-bars`)
      .selectAll("rect")
      .data(trimmedData)
      .enter()
      .append("rect")
      .attr("y", (d) => {
        return 0;
      })
      .attr("height", (d) => {
        return height - 10;
      })
      .style("width", (d) => {
        return xScale(d.value) + "px";
      })
      .attr("x", (d) => {
        return xScale(d.offset);
      })
      .attr("fill", (d, i) => colors[i])
      .attr("transform", `translate(${margin.left},0)`);

    //labels
    let total = data.filter((el) => el.key === "Total");
    svg
      .append("g")
      .attr("class", `${id}-labels`)
      .selectAll("text")
      .data(total)
      .enter()
      .append("text")
      .text((d) => {
        return commaFormatter(d.value);
      })
      .attr("x", (d) => {
        return xScale(d.offset) + xBand.bandwidth();
      })
      .attr("dx", "4em")
      .attr("y", (d) => height - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "black");
  };

  createStackedChart(workingParents_healthcare, "healthcare");
  createStackedChart(workingParents_foodRetail, "food-retail");
  createStackedChart(workingParents_restaurants, "restaurants");
  createStackedChart(workingParents_transportation, "transportation");
  createStackedChart(workingParents_personal, "personal");
  createStackedChart(workingParents_nonessential, "nonessential");
  createStackedChart(workingParents_construction, "construction");
  createStackedChart(workingParents_admin, "admin");
  createStackedChart(workingParents_education, "education");
  createStackedChart(workingParents_finance, "finance");

  // add industry labels

  industryLabels = [
    "Healthcare and Social Services",
    "Food/Drug/Beverage Retail",
    "Restaurants and Hospitality",
    "Transportation and Warehousing",
    "Personal/Other Services",
    "Nonessential Retail",
    "Construction",
    "Admin and Support Services",
    "Education",
    "Finance, Insurance, Real Estate",
  ];
  let industryLabelSpan = document.querySelectorAll(
    ".industry-container .container span"
  );
  for (let i = 0; i < industryLabelSpan.length; i++) {
    industryLabelSpan[i].textContent = industryLabels[i];
  }

  let legendIcons = document.querySelectorAll('.working-parents .legend-wrapper i')
  for (let i = 0;i<legendIcons.length;i++){
    legendIcons[i].style.backgroundColor = colors[i]
  }
};
createWorkingParentsChart();
