import DiaryEntry from '../models/diaryEntryModel.js';

/**
 * @desc    Get all diary entries for a logged-in user
 * @route   GET /api/diary
 * @access  Private
 */
const getDiaryEntries = async (req, res) => {
  try {
    const entries = await DiaryEntry.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Create a new diary entry
 * @route   POST /api/diary
 * @access  Private
 */
const createDiaryEntry = async (req, res) => {
  const { text, image, feeling } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text field is required' });
  }

  try {
    const entry = new DiaryEntry({
      user: req.user._id,
      text,
      image,
      feeling,
    });

    const createdEntry = await entry.save();
    res.status(201).json(createdEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Update a diary entry
 * @route   PUT /api/diary/:id
 * @access  Private
 */
const updateDiaryEntry = async (req, res) => {
  const { text, image, feeling } = req.body;

  try {
    const entry = await DiaryEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Check if the entry belongs to the user trying to update it
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    entry.text = text || entry.text;
    entry.image = image || entry.image;
    entry.feeling = feeling || entry.feeling;

    const updatedEntry = await entry.save();
    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Delete a diary entry
 * @route   DELETE /api/diary/:id
 * @access  Private
 */
const deleteDiaryEntry = async (req, res) => {
  try {
    const entry = await DiaryEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Check if the entry belongs to the user trying to delete it
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await entry.deleteOne();
    res.json({ message: 'Entry removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


export {
  getDiaryEntries,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
};