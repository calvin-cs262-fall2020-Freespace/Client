/***************************************************************
 * home.js
 *
 * Last modified: December 10, 2020
 *
 * home.js contains and displays the list of campus locations.
 ***************************************************************/

// Import components and libraries
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ActivityIndicator,
} from "react-native";

// Import custom components and styles
import LocationCard from "../shared/locationCard";
import { globalStyles } from "../styles/global";

/**
 * Home
 * @param {navigation} - navigation object
 * @return JSX to display Home screen list of locations
 */
export default function Home({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // List of campus locations
  const [locations, addLocation] = useState([
    {
      name: "Commons Dining Hall",
      image: require("../assets/locations/commons.jpg"),
      key: "1",
    },
    {
      name: "Knollcrest Dining Hall",
      image: require("../assets/locations/knollcrest.jpg"),
      key: "2",
    },
    {
      name: "Uppercrust",
      image: require("../assets/locations/uppercrust.jpg"),
      key: "3",
    },
    {
      name: "Johnny's",
      image: require("../assets/locations/johnnys2.jpg"),
      key: "4",
    },
    {
      name: "Peet's Coffee",
      image: require("../assets/locations/peets.jpg"),
      key: "5",
    },
  ]);

  /**
   * getLocationImage
   * @param {number} - navigation object
   * @return {string} - string that specifies color
   *                      based on activity status
   */
  function getLocationImage(locationid) {
    return locations[locationid-1].image;
  }

  // If conditional function to change the color of business based on the current state
  /**
   * getActivityStyle
   * @param {number} - average of report values
   * @return style object that specifies color
   *           based on activity status
   */
  function getActivityStyle(value) {
    if (value > 0 && value < 1.0)
      return globalStyles.notBusy;
    else if (value >= 1.0 && value < 2.0)
      return globalStyles.slightlyBusy;
    else if (value >= 2.0 && value < 3.0)
      return globalStyles.busy;
    else if (value >= 3.0 && value < 4.0)
      return globalStyles.veryBusy;
    else if (value >= 4.0)
      return globalStyles.extremelyBusy;
    else
      return globalStyles.noReports;
  }

  /**
   * getActivityStyle
   * @param {number} - average of report values
   * @return {string} - string that specifies text
   *                      based on activity status
   */
  function getActivityLevel(value) {
    if (value > 0 && value < 1.0)
      return "Not busy";
    else if (value >= 1.0 && value < 2.0)
      return "Slightly busy";
    else if (value >= 2.0 && value < 3.0)
      return "Busy";
    else if (value >= 3.0 && value < 4.0)
      return "Very busy";
    else if (value >= 4.0)
      return "Extremely busy";
    else
      return "N/A";
  }

  // Fetch data fromd atabase
  useEffect(() => {
    fetch("https://calvinfreespace.herokuapp.com/locationstatus")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [data]);

  return (
    <View style={globalStyles.homeContainer}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          style={globalStyles.locationList}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Report", item)}
            >
              <LocationCard>
                {/* Location image and name */}
                <ImageBackground
                  source={getLocationImage(item.locationid)}
                  imageStyle={globalStyles.locationImage}
                  style={globalStyles.titleContainer}
                >
                  <Text style={globalStyles.locationTitle}>
                    {item.name}
                  </Text>
                </ImageBackground>
                <View style={globalStyles.statusContainer}>

                  {/* Status title */}
                  <View style={globalStyles.statusTitleContainer}>
                    <Text style={globalStyles.statusTitle}>
                      <Text style={getActivityStyle(item.statusaverage)}>
                        {getActivityLevel(item.statusaverage)}
                      </Text>
                    </Text>
                  </View>
                  <View style={globalStyles.currentCapacityContainer}>

                    {/* Current capacity title */}
                    <Text style={globalStyles.capacityHeader}>
                      Max capacity:
                    </Text>

                    {/* Current capacity ratio */}
                    <Text style={globalStyles.numberText}>
                      {item.maxcapacity}
                    </Text>
                  </View>
                </View>
              </LocationCard>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
