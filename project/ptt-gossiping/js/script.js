window.onload = main;

function main() {
    var width = window.innerWidth,
        height = window.innerHeight;

    var svg = d3.select("svg");

    const TaiwanCoords = [121.5654, 25.033];
    const translation = [width / 2, height / 2];
    var projection = three_d_map(width / 1.8, translation, TaiwanCoords);
    var path = d3.geoPath().projection(projection);

    const InitialScale = projection.scale();
    const Sensitivity = 100;
    const CountriesColor = "#F4F6FC";
    const ocean_color = "#CCDCF2";

    const count = 10;
    var files = [
        "https://unpkg.com/world-atlas@1/world/110m.json",
        "data/info.csv",
        "data/content.json"
    ];

    var promises = [];
    files.forEach((url) => {
        let splitted_url = url.split(".");
        if (splitted_url[splitted_url.length - 1] == "json") {
            promises.push(d3.json(url));
        } else if (splitted_url[splitted_url.length - 1] == "csv") {
            promises.push(d3.csv(url));
        }
    });

    // Main Function
    //等網路資料抓好再執行then
    Promise.all(promises).then(function (values) {
        //values[0]: url, values[1]: csv
        let world = values[0];

        // Convert {info} to dictionary
        let info = values[1],
            info_dict = {};
        for (let i = 0; i < info.length; ++i) {
            let code = info[i]["代碼"];
            info_dict[code] = info[i];
        }

        let content = values[2];

        let topojson_world = topojson.feature(world, world.objects.countries);
        let target_world_mesh = topojson.mesh(
            world,
            world.objects.countries,
            function (a, b) {
                return (
                    (a.id in info_dict && info_dict[a.id]["國家"] in content) || 
                    (b.id in info_dict && info_dict[b.id]["國家"] in content)
                );
            }
        );
        let rest_world_mesh = topojson.mesh(
            world,
            world.objects.countries,
            function (a, b) {
                return !(
                    (a.id in info_dict && info_dict[a.id]["國家"] in content) || 
                    (b.id in info_dict && info_dict[b.id]["國家"] in content)
                );
            }
        );

        var tooltip = create_tooltip();
        var titlebox = create_titlebox("PTT Gossiping 地圖解析");
        var infobox = create_infobox(titlebox);
        var globe_bg = draw_globe_bg(infobox, ocean_color);
        var countries = draw_countries(
            topojson_world,
            tooltip,
            infobox,
            info_dict,
            content
        );
        var target_boundries = draw_boundries(target_world_mesh, "#111");
        var rest_boundries = draw_boundries(rest_world_mesh, "#999");
        var graticule = draw_graticule();

        enable_scroll_effect(globe_bg);
    
    });

    function three_d_map(scale, translation, center) {
        var projection = d3
            .geoOrthographic()
            .scale(scale) // 放大倍率
            .center([0, 0])
            .rotate([-center[0], -center[1]])
            .translate(translation); // 置中

        return projection;
    }

    function create_tooltip() {
        let tooltip = d3
            .select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "5")
            .style("visibility", "hidden")
            .style("background", "#fffc")
            .style("padding", ".1em .5em")
            .style("font-size", "1.2em")
            .style("border-radius", ".3em");

        return tooltip;
    }

    function create_titlebox(title) {
        let titlebox = d3
            .select("body")
            .append("div")
            .style("position", "fixed")
            .style("right", 0)
            .style("top", 0)
            .style("margin", "1em")
            .style("padding", ".5em")
            .style("background-color", "#ddd")
            .style("border-radius", ".5em")
            .style("border-style", "solid")
            .style("border-color", "#ccc3")
            .style("background-color", "transparent")
            .style("cursor", "pointer")
            .on("mouseover", function () {
                d3.select(this).style("border-color", "#ccc");
            })
            .on("mouseout", function () {
                d3.select(this).style("border-color", "#ccc3");
            });

        titlebox
            .append("div")
            .attr("class", "title")
            .style("font-size", "1.5em")
            .style("text-align", "center")
            .style("color", "#222c")
            .html(title);

        let svg = titlebox
            .append("svg")
            .style("height", "0.5em")
            .style("max-width", "21em");
        // svg.append("circle")
        //     .attr("cx", "2.5em")
        //     .attr("cy", "1.5em")
        //     .attr("r", ".5em")
        //     .style("fill", "orange");
        // svg.append("text")
        //     .attr("x", "3.5em")
        //     .attr("y", "1.5em")
        //     .text("航班數量")
        //     .style("font-size", "1em")
        //     .attr("text-anchor", "left")
        //     .attr("alignment-baseline", "middle")
        //     .style("fill", "#333d");

        return titlebox;
    }

    function create_infobox(root = null) {
        if (root == null) {
            root = d3.select("body");
        }

        let infobox = root
            .append("div")
            .attr("id", "infobox")
            .style("height", "70vh")
            .style("width", "inherit")
            .style("background-color", "#ddd")
            .style("border-radius", ".5em")
            .style("margin", ".5em")
            .style("padding", "1em")
            .style("box-sizing", "border-box")
            .style("display", "none")
            .style("background", "#8ccbbe55")
            .style("border", "1px solid #aaa9");
        // .on("click", function () {
        //     d3.select(this).style("width", "50vw").style("height", "65vh");
        // });

        infobox
            .append("div")
            .attr("class", "title")
            .style("font-size", "1.3em")
            .style("color", "#333c");

        infobox.append("div").attr("class", "content");
        // infobox.append("svg").style("width", "inherit").style("height", "100%");

        return infobox;
    }

    function draw_globe_bg(infobox, color = "#97E5EF") {
        let globe_bg = svg
            .append("circle")
            .attr("fill", color)
            .attr("stroke", "#000")
            .attr("stroke-width", "0.2")
            .attr("cx", translation[0])
            .attr("cy", translation[1])
            .attr("r", InitialScale)
            .attr("class", "globe_bg")
            .attr("cursor", "pointer")
            .on("click", function () {
                infobox.style("display", "none");
            });

        return globe_bg;
    }

    function draw_countries(world, tooltip, infobox, info_dict, content) {
        let countries = svg
            .selectAll("_path")
            .data(world.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("id", (d) => "country" + d.id)
            .style("fill", CountriesColor)
            .style("opacity", (d) => {
                if (d.id in info_dict && info_dict[d.id]["國家"] in content) {
                    return 1;
                } else {
                    return 0.85;
                }
            })
            .style("cursor", "pointer")
            .on("mouseover", function (d) {
                if (d.id in info_dict && info_dict[d.id]["國家"] in content) {
                    set_tooltip(info_dict[d.id], tooltip);
                    highlight(d.id, true);
                } else {
                    d3.select(this).style("fill", "#3339");
                }
            })
            .on("mousemove", function () {
                tooltip
                    .style("top", event.pageY - 10 + "px")
                    .style("left", event.pageX + 10 + "px");
            })
            .on("mouseout", function (d) {
                tooltip.style("visibility", "hidden");
                highlight(d.id, false);
            })
            .on("click", function (d) {
                if (d.id in info_dict && info_dict[d.id]["國家"] in content) {
                    show_info(info_dict[d.id], content, infobox);

                    let target = [info_dict[d.id]["經度"], info_dict[d.id]["緯度"]]
                    switch_view(target)
                    
                } else {
                    infobox.style("display", "none");
                }
            });

        return countries;
    }

    function highlight(code, on, country_color = "#ffb367aa") {
        if (on) {
            d3.select("#link" + code).style("opacity", 1);
            d3.select("#country" + code).style("fill", country_color);
            // d3.select("#country158" ).style("fill", country_color);
        } else {
            d3.select("#link" + code).style("opacity", 0.25);
            d3.select("#country" + code).style("fill", CountriesColor);
            // d3.select("#country158").style("fill", CountriesColor);
        }
    }

    function show_info(info_dict, content, infobox) {

        let ctry = info_dict["國家"]
        
        infobox.style("display", "block");
        infobox.select(".title").text(ctry);

        let cnt = infobox.select(".content")

        infobox.selectAll("div.r-ent").remove();
        
        for (let i = 0; i < content[ctry].length; ++i){
            let r_ent = cnt
            .append("div")
            .attr("class", "r-ent")

            let title = r_ent
            .append("div")
            .attr("class", "title")
            .append("a")
            .attr("href", content[ctry][i]["url"])
            .attr("target", "_blank")
            .text(content[ctry][i]["title"])
        }
        
        
        // content.append("div")
        // infobox.select("svg");
    }

    function set_tooltip(info_dict, tooltip) {
        tooltip.text(info_dict["國家"]).style("visibility", "visible");
    }

    function draw_boundries(world, color = "#333") {
        let boundaries = svg
            .append("path")
            .datum(world)
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", color)
            .style("stroke-width", "0.015em");

        return boundaries;
    }

    function draw_graticule(step = [10, 10]) {
        let graticule = svg
            .append("path")
            .datum(d3.geoGraticule().step(step))
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", "#bbbc")
            .style("stroke-width", 0.2);

        return graticule;
    }

    function enable_scroll_effect(globe_bg) {
        svg.call(
            d3.drag().on("drag", () => {
                const rotate = projection.rotate();
                const k = Sensitivity / projection.scale();
                projection.rotate([
                    rotate[0] + d3.event.dx * k,
                    rotate[1] - d3.event.dy * k,
                ]);
                // Update all path
                path = d3.geoPath().projection(projection);
                svg.selectAll("path").attr("d", path);
            })
        ).call(
            d3.zoom().on("zoom", () => {
                scaleK = d3.event.transform.k;
                console.log(scaleK);
                // if (scaleK > 2)         scaleK = 2;
                // else if (scaleK < 0.5)  scaleK = 0.5;
                projection.scale(InitialScale * scaleK);
                path = d3.geoPath().projection(projection);

                globe_bg.attr("r", projection.scale());
                svg.selectAll("path").attr("d", path);
            })
        );
    }

    function switch_view(target){
        let curr_rotate = projection.rotate();
        let next_rotate = [-target[0], -target[1]];
        if (next_rotate != curr_rotate) {
            svg.selectAll("path").attr("d", function (d) {
                d3.select(this)
                .transition()
                .duration(700)
                .attrTween("d", function (d) {
                    let r = d3.interpolate(curr_rotate, next_rotate);

                    return function (t) {
                        projection.rotate(r(t));
                        path = d3.geoPath().projection(projection);
                        let pathD = path(d);
                        return pathD == null ? "" : pathD;
                    };
                });
            });
        }
    }
}