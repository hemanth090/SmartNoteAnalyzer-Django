import React, { useEffect, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

const GraphMap = ({ data }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!data || !Array.isArray(data)) return;

    const newNodes = [];
    const newEdges = [];
    let nodeId = 0;

    // Create nodes and edges from the topic graph data
    data.forEach((topic, topicIndex) => {
      // Main topic node
      const mainNodeId = `main-${nodeId++}`;
      newNodes.push({
        id: mainNodeId,
        type: 'default',
        data: { 
          label: topic.label || topic.id,
        },
        position: { 
          x: topicIndex * 300, 
          y: 0 
        },
        style: {
          background: '#3b82f6',
          color: 'white',
          border: '2px solid #1d4ed8',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 'bold',
          padding: '10px',
        },
      });

      // Child nodes
      if (topic.children && Array.isArray(topic.children)) {
        topic.children.forEach((child, childIndex) => {
          const childNodeId = `child-${nodeId++}`;
          
          newNodes.push({
            id: childNodeId,
            type: 'default',
            data: { label: child },
            position: { 
              x: topicIndex * 300 + (childIndex - topic.children.length / 2) * 120, 
              y: 150 
            },
            style: {
              background: '#e5e7eb',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '12px',
              padding: '8px',
            },
          });

          // Edge from main topic to child
          newEdges.push({
            id: `edge-${mainNodeId}-${childNodeId}`,
            source: mainNodeId,
            target: childNodeId,
            type: 'smoothstep',
            style: { stroke: '#6b7280', strokeWidth: 2 },
            animated: true,
          });
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [data, setNodes, setEdges]);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-2">🧠</div>
          <p>No mind map data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-left"
      >
        <MiniMap 
          nodeColor={(node) => node.style?.background || '#3b82f6'}
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default GraphMap;