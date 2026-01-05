import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Person {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    relationshipsAsPerson1: any[];
    relationshipsAsPerson2: any[];
}

interface TreeVisualizationProps {
    data: Person[];
    onPersonClick: (personId: string) => void;
}

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ data, onPersonClick }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!data || data.length === 0 || !svgRef.current || !containerRef.current) return;

        // Clear previous render
        d3.select(svgRef.current).selectAll('*').remove();

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        // 1. Construct Hierarchy
        const personMap = new Map(data.map(p => [p.id, { ...p, children: [] as any[] }]));

        // Populate children
        data.forEach(p => {
            p.relationshipsAsPerson1.forEach((rel: any) => {
                if (rel.type === 'PARENT_CHILD') {
                    const child = personMap.get(rel.person2Id);
                    const parent = personMap.get(p.id);
                    if (child && parent) {
                        parent.children.push(child);
                    }
                }
            });
        });

        // Find root
        const childrenIds = new Set();
        data.forEach(p => {
            p.relationshipsAsPerson1.forEach((rel: any) => {
                if (rel.type === 'PARENT_CHILD') childrenIds.add(rel.person2Id);
            });
        });

        const rootPerson = data.find(p => !childrenIds.has(p.id)) || data[0];
        if (!rootPerson) return;

        const root = d3.hierarchy(personMap.get(rootPerson.id));
        const treeLayout = d3.tree().nodeSize([220, 120]);
        treeLayout(root);

        // 2. Setup Zoom
        const zoom = d3.zoom()
            .scaleExtent([0.1, 2])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .call(zoom as any)
            .on("dblclick.zoom", null); // Disable double click zoom

        const g = svg.append('g')
            .attr('transform', `translate(${width / 2}, 100)`);

        // Initial center
        svg.call(zoom.transform as any, d3.zoomIdentity.translate(width / 2, 100).scale(0.8));

        // 3. Render Links (Curved)
        g.selectAll('.link')
            .data(root.links())
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr('stroke', '#cbd5e1') // slate-300
            .attr('stroke-width', 2)
            .attr('d', d3.linkVertical()
                .x((d: any) => d.x)
                .y((d: any) => d.y) as any
            );

        // 4. Render Nodes
        const node = g.selectAll('.node')
            .data(root.descendants())
            .enter()
            .append('g')
            .attr('class', 'node cursor-pointer') // Add cursor-pointer class
            .attr('transform', (d: any) => `translate(${d.x},${d.y})`)
            .on('click', (event, d: any) => {
                event.stopPropagation(); // Stop propagation
                onPersonClick(d.data.id);
            });

        // Node Cards
        node.append('rect')
            .attr('width', 160)
            .attr('height', 60)
            .attr('x', -80)
            .attr('y', -30)
            .attr('rx', 30) // Rounded pills
            .attr('ry', 30)
            .attr('fill', 'white')
            .attr('stroke', (d: any) => d.data.gender === 'M' ? '#60a5fa' : d.data.gender === 'F' ? '#f472b6' : '#94a3b8')
            .attr('stroke-width', 2)
            .style('filter', 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))'); // Shadow

        // Text
        node.append('text')
            .attr('dy', -5)
            .attr('text-anchor', 'middle')
            .text((d: any) => d.data.firstName)
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('fill', '#1e293b') // slate-800
            .style('pointer-events', 'none'); // Prevent text from blocking click

        node.append('text')
            .attr('dy', 15)
            .attr('text-anchor', 'middle')
            .text((d: any) => d.data.lastName)
            .style('font-size', '12px')
            .style('fill', '#64748b') // slate-500
            .style('pointer-events', 'none');

    }, [data, onPersonClick]);

    return (
        <div ref={containerRef} className="w-full h-full">
            <svg ref={svgRef} className="w-full h-full block"></svg>
        </div>
    );
};

export default TreeVisualization;
