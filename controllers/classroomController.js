const { db } = require('../config/firebase');

// Get all classrooms
exports.getAllClassrooms = async (req, res) => {
  try {
    const snapshot = await db.collection('classrooms').get();
    const classrooms = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json(classrooms);
  } catch (error) {
    console.error('Error getting classrooms:', error);
    res.status(500).json({ error: 'Failed to fetch classrooms' });
  }
};

// Get classroom by ID
exports.getClassroomById = async (req, res) => {
  try {
    const doc = await db.collection('classrooms').doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ error: 'Classroom not found' });
    }
    
    res.status(200).json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error('Error getting classroom:', error);
    res.status(500).json({ error: 'Failed to fetch classroom' });
  }
};

// Filter classrooms by building and/or floor
exports.filterClassrooms = async (req, res) => {
  try {
    const { building, floor } = req.query;
    let query = db.collection('classrooms');
    
    if (building && building !== 'all') {
      query = query.where('building', '==', building);
    }
    
    if (floor && floor !== 'all') {
      query = query.where('floor', '==', parseInt(floor));
    }
    
    const snapshot = await query.get();
    const classrooms = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.status(200).json(classrooms);
  } catch (error) {
    console.error('Error filtering classrooms:', error);
    res.status(500).json({ error: 'Failed to filter classrooms' });
  }
};

// Get route between two classrooms
exports.getRoute = async (req, res) => {
  try {
    const { from, to } = req.params;
    
    // Get source and destination classrooms
    const fromDoc = await db.collection('classrooms').doc(from).get();
    const toDoc = await db.collection('classrooms').doc(to).get();
    
    if (!fromDoc.exists || !toDoc.exists) {
      return res.status(404).json({ error: 'One or both classrooms not found' });
    }
    
    const fromData = fromDoc.data();
    const toData = toDoc.data();
    
    // Generate route steps
    const steps = [];
    const isSameBuilding = fromData.building === toData.building;
    const isSameFloor = fromData.floor === toData.floor;
    
    if (isSameBuilding && isSameFloor) {
      steps.push(Exit classroom ${from});
      steps.push(Walk to classroom ${to});
    } else if (isSameBuilding) {
      steps.push(Exit classroom ${from});
      const floorDiff = Math.abs(toData.floor - fromData.floor);
      const transport = floorDiff > 1 ? 'elevator' : 'stairs';
      steps.push(Take the ${transport} to floor ${toData.floor});
      steps.push(Walk to classroom ${to});
    } else {
      steps.push(Exit classroom ${from});
      steps.push(Exit ${fromData.building});
      steps.push(Walk to ${toData.building});
      
      if (toData.floor !== 1) {
        const transport = toData.floor > 2 ? 'elevator' : 'stairs';
        steps.push(Take the ${transport} to floor ${toData.floor});
      }
      
      steps.push(Find classroom ${to});
    }
    
    // Calculate estimated time (in minutes)
    let estimatedTime = 1; // Base time
    
    if (!isSameBuilding) {
      estimatedTime += 5; // 5 minutes between buildings
    }
    
    if (!isSameFloor) {
      const floorDiff = Math.abs(toData.floor - fromData.floor);
      estimatedTime += floorDiff * 0.5; // 30 seconds per floor
    }
    
    const route = {
      from: {
        id: from,
        building: fromData.building,
        floor: fromData.floor
      },
      to: {
        id: to,
        building: toData.building,
        floor: toData.floor
      },
      steps,
      estimatedTime: Math.round(estimatedTime)
    };
    
    res.status(200).json(route);
  } catch (error) {
    console.error('Error calculating route:', error);
    res.status(500).json({ error: 'Failed to calculate route' });
  }
};