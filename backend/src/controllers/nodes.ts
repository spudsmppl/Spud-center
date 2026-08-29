import { Response } from 'express';
import axios from 'axios';
import Node from '../models/Node.js';
import Preview from '../models/Preview.js';
import { AuthRequest } from '../middleware/auth.js';
import * as cheerio from 'cheerio';

// Helper function to check node status
export const checkNodeStatus = async (url: string) => {
  try {
    const startTime = Date.now();
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'SpudCenter/1.0'
      }
    });
    const responseTime = Date.now() - startTime;

    let status = 'live';
    if (response.status >= 200 && response.status < 300) {
      status = 'live';
    } else if (response.status >= 400 && response.status < 500) {
      status = 'stopped';
    } else if (response.status >= 500) {
      status = 'unstable';
    }

    return {
      status,
      statusCode: response.status,
      responseTime,
      success: true
    };
  } catch (error: any) {
    return {
      status: 'stopped',
      statusCode: error.response?.status || 0,
      responseTime: 0,
      success: false,
      error: error.message
    };
  }
};

export const createNode = async (req: AuthRequest, res: Response) => {
  try {
    const { name, url, description, checkInterval } = req.body;

    if (!name || !url) {
      return res.status(400).json({ message: 'Name and URL are required' });
    }

    const existingNode = await Node.findOne({ name });
    if (existingNode) {
      return res.status(400).json({ message: 'Node with this name already exists' });
    }

    const apiKey = `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const node = await Node.create({
      name,
      url,
      description,
      checkInterval: checkInterval || 60000,
      createdBy: req.userId,
      apiKey
    });

    // Initial status check
    const statusData = await checkNodeStatus(url);
    await Node.updateOne({ _id: node._id }, statusData);

    res.status(201).json({
      message: 'Node created successfully',
      node
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating node', error });
  }
};

export const getNodes = async (req: AuthRequest, res: Response) => {
  try {
    const nodes = await Node.find({ createdBy: req.userId }).select('-apiKey');
    res.status(200).json(nodes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching nodes', error });
  }
};

export const getNode = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const node = await Node.findOne({ _id: id, createdBy: req.userId }).select('-apiKey');

    if (!node) {
      return res.status(404).json({ message: 'Node not found' });
    }

    res.status(200).json(node);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching node', error });
  }
};

export const updateNode = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, url, description, checkInterval } = req.body;

    const node = await Node.findOne({ _id: id, createdBy: req.userId });
    if (!node) {
      return res.status(404).json({ message: 'Node not found' });
    }

    if (name && name !== node.name) {
      const existingNode = await Node.findOne({ name });
      if (existingNode) {
        return res.status(400).json({ message: 'Node with this name already exists' });
      }
      node.name = name;
    }

    if (url) node.url = url;
    if (description) node.description = description;
    if (checkInterval) node.checkInterval = checkInterval;
    node.updatedAt = new Date();

    await node.save();

    // Re-check status with new URL if changed
    if (url) {
      const statusData = await checkNodeStatus(url);
      await Node.updateOne({ _id: id }, statusData);
    }

    res.status(200).json({
      message: 'Node updated successfully',
      node
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating node', error });
  }
};

export const deleteNode = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const node = await Node.findOne({ _id: id, createdBy: req.userId });
    if (!node) {
      return res.status(404).json({ message: 'Node not found' });
    }

    await Node.deleteOne({ _id: id });
    await Preview.deleteOne({ nodeId: id });

    res.status(200).json({ message: 'Node deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting node', error });
  }
};

export const getNodeStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const node = await Node.findOne({ _id: id, createdBy: req.userId });
    if (!node) {
      return res.status(404).json({ message: 'Node not found' });
    }

    const statusData = await checkNodeStatus(node.url);
    await Node.updateOne({ _id: id }, {
      ...statusData,
      lastChecked: new Date()
    });

    res.status(200).json(statusData);
  } catch (error) {
    res.status(500).json({ message: 'Error checking node status', error });
  }
};

export const startMonitoring = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const node = await Node.findOne({ _id: id, createdBy: req.userId });
    if (!node) {
      return res.status(404).json({ message: 'Node not found' });
    }

    node.isMonitoring = true;
    await node.save();

    res.status(200).json({ message: 'Monitoring started', node });
  } catch (error) {
    res.status(500).json({ message: 'Error starting monitoring', error });
  }
};

export const stopMonitoring = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const node = await Node.findOne({ _id: id, createdBy: req.userId });
    if (!node) {
      return res.status(404).json({ message: 'Node not found' });
    }

    node.isMonitoring = false;
    await node.save();

    res.status(200).json({ message: 'Monitoring stopped', node });
  } catch (error) {
    res.status(500).json({ message: 'Error stopping monitoring', error });
  }
};
