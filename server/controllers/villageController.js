import Village from '../models/Village.js';

// Create
export const addVillage = async (req, res) => {
  try {
    const { villageName } = req.body;
    const existing = await Village.findOne({ villageName });
    if (existing) return res.status(400).json({ message: 'Village already exists' });

    const villageCode = villageName.substring(0, 3).toUpperCase() + Math.floor(100 + Math.random() * 900);
    const newVillage = new Village({ villageName, villageCode });
    await newVillage.save();
    res.status(201).json(newVillage);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add village', error: err.message });
  }
};

// Read
export const getVillages = async (req, res) => {
  try {
    const villages = await Village.find();
    res.json(villages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch villages' });
  }
};

// Update
export const updateVillage = async (req, res) => {
  try {
    const { id } = req.params;
    const { villageName } = req.body;
    const villageCode = villageName.substring(0, 3).toUpperCase() + Math.floor(100 + Math.random() * 900);

    const updated = await Village.findByIdAndUpdate(
      id,
      { villageName, villageCode },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update village', error: err.message });
  }
};

// Delete
export const deleteVillage = async (req, res) => {
  try {
    const { id } = req.params;
    await Village.findByIdAndDelete(id);
    res.json({ message: 'Village deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete village' });
  }
};
