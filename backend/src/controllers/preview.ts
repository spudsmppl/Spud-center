import { Response } from 'express';
import axios from 'axios';
import Node from '../models/Node.js';
import Preview from '../models/Preview.js';
import { AuthRequest } from '../middleware/auth.js';
import * as cheerio from 'cheerio';

export const capturePreview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const node = await Node.findOne({ _id: id, createdBy: req.userId });
    if (!node) {
      return res.status(404).json({ message: 'Node not found' });
    }

    // Fetch the website HTML
    const response = await axios.get(node.url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'SpudCenter/1.0'
      }
    });

    // Parse HTML to extract metadata
    const $ = cheerio.load(response.data);
    const title = $('title').text() || node.name;
    const description = $('meta[name="description"]').attr('content') || 'No description available';

    let preview = await Preview.findOne({ nodeId: id });

    if (!preview) {
      preview = await Preview.create({
        nodeId: id,
        title,
        description,
        htmlSnapshot: response.data.substring(0, 50000), // Store first 50KB of HTML
        lastCaptured: new Date()
      });
    } else {
      preview.title = title;
      preview.description = description;
      preview.htmlSnapshot = response.data.substring(0, 50000);
      preview.lastCaptured = new Date();
      await preview.save();
    }

    res.status(200).json({
      message: 'Preview captured successfully',
      preview
    });
  } catch (error) {
    res.status(500).json({ message: 'Error capturing preview', error });
  }
};

export const getPreview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const node = await Node.findOne({ _id: id, createdBy: req.userId });
    if (!node) {
      return res.status(404).json({ message: 'Node not found' });
    }

    let preview = await Preview.findOne({ nodeId: id });

    if (!preview) {
      // Try to capture it now
      try {
        const response = await axios.get(node.url, {
          timeout: 5000,
          headers: {
            'User-Agent': 'SpudCenter/1.0'
          }
        });

        const $ = cheerio.load(response.data);
        const title = $('title').text() || node.name;
        const description = $('meta[name="description"]').attr('content') || 'No description';

        preview = await Preview.create({
          nodeId: id,
          title,
          description,
          htmlSnapshot: response.data.substring(0, 50000),
          lastCaptured: new Date()
        });
      } catch (error) {
        return res.status(500).json({ message: 'Unable to capture preview' });
      }
    }

    res.status(200).json(preview);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching preview', error });
  }
};

export const getLivePreview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const node = await Node.findOne({ _id: id, createdBy: req.userId });
    if (!node) {
      return res.status(404).json({ message: 'Node not found' });
    }

    // Fetch live HTML
    const response = await axios.get(node.url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'SpudCenter/1.0'
      }
    });

    const $ = cheerio.load(response.data);

    // Return sanitized HTML for preview
    res.status(200).json({
      title: $('title').text() || node.name,
      content: response.data.substring(0, 100000),
      statusCode: response.status,
      lastFetched: new Date()
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error fetching live preview',
      error: error.message
    });
  }
};
