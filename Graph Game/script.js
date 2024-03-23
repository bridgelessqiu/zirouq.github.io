document.addEventListener("DOMContentLoaded", function() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Define the drop shadow filter
    // const defs = svg.append("defs");
    // const filter = defs.append("filter")
    //     .attr("id", "drop-shadow")
    //     .attr("height", "130%");
    // filter.append("feGaussianBlur")
    //     .attr("in", "SourceAlpha")
    //     .attr("stdDeviation", 3)
    //     .attr("result", "blur");
    // filter.append("feOffset")
    //     .attr("in", "blur")
    //     .attr("dx", 2)
    //     .attr("dy", 2)
    //     .attr("result", "offsetBlur");
    // const feMerge = filter.append("feMerge");
    // feMerge.append("feMergeNode")
    //     .attr("in", "offsetBlur");
    // feMerge.append("feMergeNode")
    //     .attr("in", "SourceGraphic");

    let nodes = [];
    let links = [];
    let selectedNode = null;

    const updateGraph = () => {
        // Updating links
        const linkElements = svg.selectAll(".link")
            .data(links, d => d.index)
            .join("line")
            .classed("link", true)
            .attr("stroke", d => d.highlighted ? "#ffa590" : "#4178be")
            .attr("stroke-width", d => d.highlighted ? 9 : 5)
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
            .on("contextmenu", deleteEdge)
            .on("dblclick", highlightEdge);

        // Updating nodes with drop shadow effect
        const nodeElements = svg.selectAll(".node")
            .data(nodes, d => d.id)
            .join("circle")
            .classed("node", true)
            .attr("r", 20)
            .attr("fill", "blue")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .style("filter", "url(#drop-shadow)")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged))
            .on("click", nodeClicked)
            .on("contextmenu", deleteNode);

        nodeElements.raise(); // Ensures nodes are drawn over links
    };

    const dragstarted = (event, d) => {
        d.fx = d.x;
        d.fy = d.y;
    };

    const dragged = (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
        d.x = event.x;
        d.y = event.y;
        updateGraph();
    };

    const nodeClicked = (event, d) => {
        if (selectedNode) {
            const newLink = {source: selectedNode, target: d, highlighted: false, index: links.length};
            links.push(newLink);
            selectedNode = null;
        } else {
            selectedNode = d;
        }
        updateGraph();
    };

    const deleteNode = (event, d) => {
        event.preventDefault();
        nodes = nodes.filter(node => node.id !== d.id);
        links = links.filter(link => link.source.id !== d.id && link.target.id !== d.id);
        updateGraph();
    };

    const deleteEdge = (event, d) => {
        event.preventDefault();
        links = links.filter(link => link !== d);
        updateGraph();
    };

    const highlightEdge = (event, d) => {
        event.stopPropagation(); // Prevent the event from bubbling up to the SVG
        d.highlighted = !d.highlighted;
        updateGraph();
    };

    svg.on("dblclick", (event) => {
        const coords = d3.pointer(event);
        const newNode = {id: nodes.length + 1, x: coords[0], y: coords[1]};
        nodes.push(newNode);
        updateGraph();
    });

    updateGraph();
});
