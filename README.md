# Seattle Crime Smart Dashboard
Seattle, a city home to a large tech industry, with Microsoft and Amazon headquartered in its metropolitan area. However, the streets of Seattle may not be safe as one might think. With a crime rate of 66 per one thousand residents, Seattle has one of the highest crime rates in all of America compared to other cities. Here in rainy city, one's chance of becoming a victim of either violent or property crime here is one in 15. 

This project is a prototype to the final version of the Smart Dashbaord to visualize all crime reported in Seattle from 2022 to the present. Some key elements that will be featured or improved upon the final version are the bar chart and the dynamic visualization that appears when the user clicks on a neighborhood of Seattle, further elaborating on the data on the screen. We also plant to add filter options on crime offenses and time. The data for this project was retreieved from [Seattle Open Data](https://data.seattle.gov/Public-Safety/SPD-Crime-Data-2008-Present/tazs-3rd5/about_data) and filtered for data from 2022 to the latest data they have. 

#### (2022 - rpesent) Seattle Crime Report Data
![Seattle Crime Choropleth Map](img\choroplethMap.png)
- Webmap can be accessed [here](https://rj002-chris.github.io/crime-dashboard/)

For this topic, I chose to display the data as a choropleth map because the original dataset contained the individual points (crime reports), including their latitude and longitutde of where they were reported. Since the data visualization was not easy to observe as individual points on the map, so I found a [dataset](https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::neighborhood-map-atlas-neighborhoods/explore?location=47.677875%2C-122.323620%2C14.35) containing neighborhoods in Seattle and spatially joined them before calculating the total number of crime reports within each neighborhood. There are also two data visualization components:
- bar chart
- dynamic visualization that appears when the user clicks on a neighborhood of Seattle

#### Acknowledgments
- One crime report can contain multiple offenses
- Dataset only contains crimes reported to and recorded by Seattle Police
- For more information on definitions and classifications, please visit [this website](https://www.fbi.gov/services/cjis/ucr/nibrs)
These inforgraphics were made using Mapbox Studio and and were implemented in JS.