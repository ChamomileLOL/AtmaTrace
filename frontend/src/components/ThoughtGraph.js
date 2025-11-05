// frontend/src/components/ThoughtGraph.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

// Constants for the simulation
const WIDTH = 900;
const HEIGHT = 600;
const NODE_RADIUS = 20;

const ThoughtGraph = ({ thoughts }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (thoughts.length === 0) return;

    // 1. D3 Data Preparation: Convert linear thought list into graph structure (nodes and links)
    const nodes = thoughts.map(t => ({ 
        id: t._id, 
        content: t.content, 
        emotion: t.emotion,
        tag: t.emotionTag,
        createdAt: t.createdAt
    }));

    // 2. Create Links (Edges): Connect each thought to its parent
    const links = [];
    const nodeMap = new Map(nodes.map(node => [node.id, node]));

    nodes.forEach(node => {
      const originalThought = thoughts.find(t => t._id === node.id);
      if (originalThought && originalThought.parentThought) {
        if (nodeMap.has(originalThought.parentThought)) {
          links.push({
            source: originalThought.parentThought, // ID of the source node
            target: node.id,                       // ID of the target node
          });
        }
      }
    });

    // Clear any previous graph
    const svg = d3.select(svgRef.current)
        .attr("viewBox", [0, 0, WIDTH, HEIGHT]);
    svg.selectAll('*').remove();

    // 3. Initialize the Force Simulation
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(150)) // Set link distance
        .force("charge", d3.forceManyBody().strength(-300)) // Repel nodes
        .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2)); // Center the graph


    // 4. Draw Links (Edges)
    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", 1);


    // 5. Draw Nodes
    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", NODE_RADIUS)
        .attr("fill", d => {
            // Color nodes based on emotion (simple mapping)
            switch(d.tag) {
                case 'Joy': return '#4ade80'; // Green
                case 'Fear': return '#f87171'; // Red
                case 'Anger': return '#fb923c'; // Orange
                case 'Calm': return '#60a5fa'; // Blue
                default: return '#9ca3af'; // Gray (Neutral/Other)
            }
        })
        .call(drag(simulation)); // Enable dragging

    // 6. Add Labels (Text) to Nodes
    const label = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("fill", "#333")
        .style("font-size", "10px")
        .text(d => d.tag); // Display the emotion tag


    // 7. Tick Function: Update element positions on every simulation step
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        label
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });

  }, [thoughts]);


  // 8. Drag Functionality (D3 utility)
  const drag = (simulation) => {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  };

  return (
    <svg ref={svgRef} width="100%" height={HEIGHT}>
        {/* The D3 elements will be mounted here */}
    </svg>
  );
};

export default ThoughtGraph;