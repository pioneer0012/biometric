import net from 'net';
import Biometric from '../models/BiometricModel.js';

// Fetch data from the biometric device
export const fetchBiometricData = async (req, res) => {
  const DEVICE_IP = process.env.DEVICE_IP || '192.168.1.201'; // Biometric device IP
  const DEVICE_PORT = parseInt(process.env.DEVICE_PORT || 4370, 10); // Port for biometric device

  const client = new net.Socket();

  try {
    client.connect(DEVICE_PORT, DEVICE_IP, () => {
      console.log(`Connected to biometric device at ${DEVICE_IP}:${DEVICE_PORT}`);
      // Replace with the correct command for fetching attendance logs or data from the device
      const command = Buffer.from([0x0F, 0x01]); // Example command, adjust accordingly
      client.write(command);
    });

    client.on('data', async (data) => {
      try {
        // Log raw data to understand the structure
        console.log('Received raw data:', data);

        // Optionally, if the data is binary or not easily read as JSON, you can log it as a hexadecimal string for clarity
        console.log('Received raw data (hex):', data.toString('hex'));

        // Try parsing the data (if it’s in a structured format like JSON)
        let parsedData;
        try {
          parsedData = JSON.parse(data.toString()); // Try parsing as JSON if applicable
        } catch (error) {
          console.error("Error parsing data:", error.message);
          parsedData = data.toString(); // If not JSON, log raw string or buffer
        }

        // Create new record and save to MongoDB (if data parsing succeeds)
        const newRecord = new Biometric({
          userId: parsedData.userId || 'Unknown',
          deviceId: DEVICE_IP,
          data: parsedData,
        });

        await newRecord.save();
        res.status(200).json({ message: 'Data fetched and saved successfully', record: newRecord });

        client.destroy(); // Close connection
      } catch (err) {
        console.error('Error processing received data:', err.message);
        res.status(500).json({ message: 'Error processing device data', error: err.message });
        client.destroy();
      }
    });

    client.on('error', (err) => {
      console.error('Socket error:', err.message);
      res.status(500).json({ message: 'Device connection error', error: err.message });
      client.destroy();
    });

    client.setTimeout(10000, () => {
      console.error('Socket timeout reached.');
      res.status(408).json({ message: 'Device connection timed out' });
      client.destroy();
    });
  } catch (error) {
    console.error('Error in fetchBiometricData:', error.message);
    res.status(500).json({ message: 'Internal server error', error: error.message });
    client.destroy();
  }
};
