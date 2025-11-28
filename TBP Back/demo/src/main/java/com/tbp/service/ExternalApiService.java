package com.tbp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExternalApiService {
    
    private final RestTemplate restTemplate;
    
    @Value("${amadeus.api.key:}")
    private String amadeusApiKey;
    
    @Value("${amadeus.api.secret:}")
    private String amadeusApiSecret;
    
    
    public ExternalApiService() {
        this.restTemplate = new RestTemplate();
    }
    
    // Amadeus Flight Search API
    public List<Map<String, Object>> searchFlights(String origin, String destination, String departureDate, int adults) {
        try {
            // Get access token first
            String accessToken = getAmadeusAccessToken();
            if (accessToken == null) {
                return getMockFlightData(origin, destination, departureDate);
            }
            
            String url = "https://test.api.amadeus.com/v2/shopping/flight-offers";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                    .queryParam("originLocationCode", origin)
                    .queryParam("destinationLocationCode", destination)
                    .queryParam("departureDate", departureDate)
                    .queryParam("adults", adults)
                    .queryParam("max", 10);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                    builder.toUriString(), HttpMethod.GET, entity, Map.class);
            
            if (response.getBody() != null) {
                return extractFlightData(response.getBody());
            }
        } catch (Exception e) {
            System.err.println("Error calling Amadeus API: " + e.getMessage());
        }
        
        return getMockFlightData(origin, destination, departureDate);
    }
    
    // Amadeus Hotel Search API
    public List<Map<String, Object>> searchHotels(String cityCode, String checkIn, String checkOut, int adults) {
        try {
            String accessToken = getAmadeusAccessToken();
            if (accessToken == null) {
                return getMockHotelData(cityCode, checkIn, checkOut);
            }
            
            String url = "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            
            UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                    .queryParam("cityCode", cityCode);
            
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                    builder.toUriString(), HttpMethod.GET, entity, Map.class);
            
            if (response.getBody() != null) {
                return extractHotelData(response.getBody(), checkIn, checkOut);
            }
        } catch (Exception e) {
            System.err.println("Error calling Amadeus Hotel API: " + e.getMessage());
        }
        
        return getMockHotelData(cityCode, checkIn, checkOut);
    }
    
    // Mock Cab/Taxi service (using a generic transportation API or mock data)
    public List<Map<String, Object>> searchCabs(String pickup, String dropoff, String pickupTime) {
        // For cabs, we'll use mock data since most cab APIs require specific partnerships
        return getMockCabData(pickup, dropoff, pickupTime);
    }
    
    private String getAmadeusAccessToken() {
        try {
            if (amadeusApiKey == null || amadeusApiKey.isEmpty() || 
                amadeusApiSecret == null || amadeusApiSecret.isEmpty()) {
                return null;
            }
            
            String url = "https://test.api.amadeus.com/v1/security/oauth2/token";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/x-www-form-urlencoded");
            
            String body = "grant_type=client_credentials&client_id=" + amadeusApiKey + 
                         "&client_secret=" + amadeusApiSecret;
            
            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, Map.class);
            
            if (response.getBody() != null) {
                return (String) response.getBody().get("access_token");
            }
        } catch (Exception e) {
            System.err.println("Error getting Amadeus access token: " + e.getMessage());
        }
        return null;
    }
    
    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> extractFlightData(Map<String, Object> response) {
        // Extract flight data from Amadeus response
        List<Map<String, Object>> flights = (List<Map<String, Object>>) response.get("data");
        if (flights == null) return getMockFlightData("", "", "");
        
        return flights.stream().map(flight -> {
            Map<String, Object> result = new HashMap<>();
            result.put("flightNumber", flight.get("id"));
            result.put("price", flight.get("price"));
            result.put("currency", "USD");
            
            // Extract itinerary details
            List<Map<String, Object>> itineraries = (List<Map<String, Object>>) flight.get("itineraries");
            if (itineraries != null && !itineraries.isEmpty()) {
                Map<String, Object> itinerary = itineraries.get(0);
                List<Map<String, Object>> segments = (List<Map<String, Object>>) itinerary.get("segments");
                if (segments != null && !segments.isEmpty()) {
                    Map<String, Object> segment = segments.get(0);
                    result.put("from", segment.get("departure"));
                    result.put("to", segment.get("arrival"));
                    result.put("departureTime", segment.get("departure"));
                    result.put("arrivalTime", segment.get("arrival"));
                }
            }
            
            return result;
        }).toList();
    }
    
    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> extractHotelData(Map<String, Object> response, String checkIn, String checkOut) {
        // Extract hotel data from Amadeus response
        List<Map<String, Object>> hotels = (List<Map<String, Object>>) response.get("data");
        if (hotels == null) return getMockHotelData("", checkIn, checkOut);
        
        return hotels.stream().map(hotel -> {
            Map<String, Object> result = new HashMap<>();
            result.put("hotelId", hotel.get("hotelId"));
            result.put("name", hotel.get("name"));
            result.put("checkIn", checkIn);
            result.put("checkOut", checkOut);
            result.put("pricePerNight", 120.0); // Default price
            result.put("currency", "USD");
            return result;
        }).toList();
    }
    
    // Mock data methods for when APIs are not available
    private List<Map<String, Object>> getMockFlightData(String origin, String destination, String departureDate) {
        return List.of(
            Map.of(
                "flightNumber", "AA101",
                "airline", "American Airlines",
                "from", origin.isEmpty() ? "JFK" : origin,
                "to", destination.isEmpty() ? "LAX" : destination,
                "departureTime", departureDate + "T08:00:00",
                "arrivalTime", departureDate + "T11:30:00",
                "price", 299.99,
                "currency", "USD"
            ),
            Map.of(
                "flightNumber", "DL202",
                "airline", "Delta Airlines",
                "from", origin.isEmpty() ? "JFK" : origin,
                "to", destination.isEmpty() ? "LAX" : destination,
                "departureTime", departureDate + "T14:00:00",
                "arrivalTime", departureDate + "T17:30:00",
                "price", 349.50,
                "currency", "USD"
            ),
            Map.of(
                "flightNumber", "UA303",
                "airline", "United Airlines",
                "from", origin.isEmpty() ? "JFK" : origin,
                "to", destination.isEmpty() ? "LAX" : destination,
                "departureTime", departureDate + "T19:00:00",
                "arrivalTime", departureDate + "T22:30:00",
                "price", 279.99,
                "currency", "USD"
            )
        );
    }
    
    private List<Map<String, Object>> getMockHotelData(String cityCode, String checkIn, String checkOut) {
        return List.of(
            Map.of(
                "hotelId", "HOTEL001",
                "name", "Grand Plaza Hotel",
                "city", cityCode.isEmpty() ? "New York" : cityCode,
                "checkIn", checkIn,
                "checkOut", checkOut,
                "pricePerNight", 199.99,
                "currency", "USD",
                "rating", 4.5,
                "amenities", List.of("WiFi", "Pool", "Gym", "Restaurant")
            ),
            Map.of(
                "hotelId", "HOTEL002",
                "name", "Business Center Hotel",
                "city", cityCode.isEmpty() ? "New York" : cityCode,
                "checkIn", checkIn,
                "checkOut", checkOut,
                "pricePerNight", 149.99,
                "currency", "USD",
                "rating", 4.2,
                "amenities", List.of("WiFi", "Business Center", "Restaurant")
            ),
            Map.of(
                "hotelId", "HOTEL003",
                "name", "Budget Inn",
                "city", cityCode.isEmpty() ? "New York" : cityCode,
                "checkIn", checkIn,
                "checkOut", checkOut,
                "pricePerNight", 89.99,
                "currency", "USD",
                "rating", 3.8,
                "amenities", List.of("WiFi", "Parking")
            )
        );
    }
    
    private List<Map<String, Object>> getMockCabData(String pickup, String dropoff, String pickupTime) {
        return List.of(
            Map.of(
                "providerId", "UBER001",
                "provider", "Uber",
                "vehicleType", "Standard",
                "pickup", pickup,
                "dropoff", dropoff,
                "pickupTime", pickupTime,
                "estimatedDuration", "25 minutes",
                "price", 18.50,
                "currency", "USD"
            ),
            Map.of(
                "providerId", "LYFT001",
                "provider", "Lyft",
                "vehicleType", "Standard",
                "pickup", pickup,
                "dropoff", dropoff,
                "pickupTime", pickupTime,
                "estimatedDuration", "28 minutes",
                "price", 16.75,
                "currency", "USD"
            ),
            Map.of(
                "providerId", "TAXI001",
                "provider", "Local Taxi",
                "vehicleType", "Taxi",
                "pickup", pickup,
                "dropoff", dropoff,
                "pickupTime", pickupTime,
                "estimatedDuration", "30 minutes",
                "price", 22.00,
                "currency", "USD"
            )
        );
    }
}
