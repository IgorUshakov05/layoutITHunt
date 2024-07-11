async function getCityPath(cityName) {
    const url = "https://api.hh.ru/areas";
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: Unable to fetch data from API, status code: ${response.status}`);
        }

        const data = await response.json();

        function findCityPath(cityName, areas, path = []) {
            let foundPaths = [];

            for (const area of areas) {
                const newPath = [...path, area.name];
                if (area.areas && area.areas.length > 0) {
                    const results = findCityPath(cityName, area.areas, newPath);
                    if (results.length > 0) {
                        foundPaths = foundPaths.concat(results);
                    }
                } else {
                    // Проверяем начальные символы (по ближайшему совпадению)
                    if (area.name.toLowerCase().startsWith(cityName.toLowerCase())) {
                        foundPaths.push(newPath);
                    }
                }
            }
            return foundPaths;
        }

        const cityPaths = findCityPath(cityName, data);
        if (cityPaths.length > 0) {
            console.log(cityPaths)
            return cityPaths.map(path => `${path.join(', ')}`);
        } else {
            return false
        }
    } catch (error) {
        console.error(error.message);
        return false
    }
}

module.exports = getCityPath