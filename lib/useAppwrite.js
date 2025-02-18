import { useState, useEffect } from "react";
import { Alert } from "react-native";

const useAppwrite = (fn) => { 
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fn(); // Call the passed function to fetch data
      setData(response);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Runs once when the component mounts

  const refetch = () => fetchData(); 

  return { data, isLoading, refetch }; // Returns the state and refresh function
};

export default useAppwrite;
