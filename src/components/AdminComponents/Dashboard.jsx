import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

// ==========================================
// 1. API CONFIG & HELPERS
// ==========================================
const API_BASE_URL = "http://localhost:3002/api";

const apiClient = {
  get: async (endpoint) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!res.ok) throw new Error(`GET ${endpoint} failed`);
    return res.json();
  },
};

const parseDecimal128 = (value) => {
  if (value && value.$numberDecimal !== undefined)
    return Number(value.$numberDecimal);
  return Number(value) || 0;
};

// ==========================================
// 2. SHARED CONSTANTS
// ==========================================
const categoryColors = {
  Romance: "#F472B6", // Pink
  SelfHelp: "#60A5FA", // Blue
  SciFi: "#A78BFA", // Purple
  History: "#FBBF24", // Yellow
};

const targetMonthlySales = 50000; // Define your target here (THB)

// ==========================================
// 3. CHART COMPONENTS
// ==========================================
const LineChart = ({ data }) => {
  const svgRef = useRef();
  const categories = ["Romance", "SelfHelp", "SciFi", "History"];
  const displayNames = {
    Romance: "Romance",
    SelfHelp: "Self help",
    SciFi: "Sci fi",
    History: "History",
  };

  useEffect(() => {
    if (!data || data.length === 0) return;
    const width = 450;
    const height = 220;
    const margin = { top: 15, right: 20, bottom: 25, left: 45 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const x = d3
      .scalePoint()
      .domain(data.map((d) => d.month))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    // Find dynamic max for Y axis
    const maxVal =
      d3.max(data, (d) =>
        Math.max(d.Romance, d.SelfHelp, d.SciFi, d.History),
      ) || 30;
    const y = d3
      .scaleLinear()
      .domain([0, maxVal * 1.2])
      .range([height - margin.bottom, margin.top]);

    const g = svg.append("g");

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(y.ticks(5))
      .join("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", "#e5e7eb")
      .attr("stroke-dasharray", "3,3");

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .call((g) => g.select(".domain").remove());
    g.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .call((g) => g.select(".domain").remove());

    // Y Axis Label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 12)
      .attr("x", 0 - height / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "500")
      .style("fill", "#6b7280")
      .text("Orders (Units)");

    categories.forEach((category) => {
      const lineGenerator = d3
        .line()
        .x((d) => x(d.month))
        .y((d) => y(d[category]));
      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", categoryColors[category])
        .attr("stroke-width", 2.5)
        .attr("d", lineGenerator);
      g.selectAll(`.dot-${category}`)
        .data(data)
        .join("circle")
        .attr("class", `dot-${category}`)
        .attr("cx", (d) => x(d.month))
        .attr("cy", (d) => y(d[category]))
        .attr("r", 3.5)
        .attr("fill", categoryColors[category]);
    });
  }, [data]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-3 mb-1 text-[11px] font-medium text-gray-600">
        {categories.map((cat) => (
          <div key={cat} className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: categoryColors[cat] }}
            ></span>
            {displayNames[cat]}
          </div>
        ))}
      </div>
      <svg
        ref={svgRef}
        viewBox="0 0 450 220"
        className="w-full max-w-[400px] overflow-visible"
      />
    </div>
  );
};

const BarChart = ({ data }) => {
  const svgRef = useRef();
  const subgroups = ["Romance", "SelfHelp", "SciFi", "History"];
  const displayNames = {
    Romance: "Romance",
    SelfHelp: "Self help",
    SciFi: "Sci fi",
    History: "History",
  };

  useEffect(() => {
    if (!data || data.length === 0) return;
    const width = 450;
    const height = 220;
    const margin = { top: 15, right: 20, bottom: 25, left: 55 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const groups = data.map((d) => d.month);
    const x = d3
      .scaleBand()
      .domain(groups)
      .range([margin.left, width - margin.right])
      .padding([0.2]);
    const xSubgroup = d3
      .scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.05]);

    // Find dynamic max for Y axis
    const maxVal =
      d3.max(data, (d) =>
        Math.max(d.Romance, d.SelfHelp, d.SciFi, d.History),
      ) || 3000;
    const y = d3
      .scaleLinear()
      .domain([0, maxVal * 1.2])
      .range([height - margin.bottom, margin.top]);

    const color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range([
        categoryColors.Romance,
        categoryColors.SelfHelp,
        categoryColors.SciFi,
        categoryColors.History,
      ]);

    const g = svg.append("g");

    // Grid lines & Bars
    g.append("g")
      .selectAll("line")
      .data(y.ticks(4))
      .join("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", "#e5e7eb");
    g.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${x(d.month)},0)`)
      .selectAll("rect")
      .data((d) => subgroups.map((key) => ({ key, value: d[key] })))
      .join("rect")
      .attr("x", (d) => xSubgroup(d.key))
      .attr("y", (d) => y(d.value))
      .attr("width", xSubgroup.bandwidth())
      .attr("height", (d) => height - margin.bottom - y(d.value))
      .attr("fill", (d) => color(d.key))
      .attr("rx", 2);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call((g) => g.select(".domain").remove());
    g.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(4))
      .call((g) => g.select(".domain").remove());

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 14)
      .attr("x", 0 - height / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "500")
      .style("fill", "#6b7280")
      .text("Sales (THB)");
  }, [data]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-3 mb-1 text-[11px] font-medium text-gray-600">
        {subgroups.map((cat) => (
          <div key={cat} className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: categoryColors[cat] }}
            ></span>
            {displayNames[cat]}
          </div>
        ))}
      </div>
      <svg
        ref={svgRef}
        viewBox="0 0 450 220"
        className="w-full max-w-[400px] overflow-visible"
      />
    </div>
  );
};

const DonutChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;
    const width = 280;
    const height = 280;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);
    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);
    const arc = d3
      .arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.9);
    const outerArc = d3
      .arc()
      .innerRadius(radius * 1)
      .outerRadius(radius * 1);

    const arcs = g.selectAll("arc").data(pie(data)).enter().append("g");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "white")
      .style("stroke-width", "2px");
    arcs
      .append("text")
      .attr("transform", (d) => {
        const pos = outerArc.centroid(d);
        pos[0] = radius * (midAngle(d) < Math.PI ? 1.05 : -1.05);
        return `translate(${pos})`;
      })
      .style("text-anchor", (d) => (midAngle(d) < Math.PI ? "start" : "end"))
      .style("font-size", "11px")
      .style("fill", "#4b5563")
      .selectAll("tspan")
      .data((d) => [d.data.category, `${d.data.value}%`])
      .enter()
      .append("tspan")
      .attr("x", 0)
      .attr("dy", (d, i) => (i === 0 ? "-0.2em" : "1.2em"))
      .text((d) => d);

    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
  }, [data]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 320 280"
      className="w-full max-w-[280px] overflow-visible"
    />
  );
};

const GaugeChart = ({ value }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 260;
    const height = 150;
    const margin = 10;
    const radius = Math.min(width, height * 2) / 2 - margin;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height - margin})`);
    const arc = d3
      .arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2);

    g.append("path")
      .datum({ endAngle: Math.PI / 2 })
      .style("fill", "#BFD7FE")
      .attr("d", arc);
    const angle = -Math.PI / 2 + Math.PI * (Math.min(value, 100) / 100);
    g.append("path")
      .datum({ endAngle: angle })
      .style("fill", "#4F85F6")
      .attr("d", arc);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-5px")
      .style("font-size", "42px")
      .style("fill", "#000")
      .text(`${Math.round(value)}%`);
  }, [value]);

  return (
    <svg ref={svgRef} viewBox="0 0 260 150" className="w-full max-w-[260px]" />
  );
};

// ==========================================
// 4. MAIN DASHBOARD COMPONENT
// ==========================================
export function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndAggregateData = async () => {
      try {
        setLoading(true);
        // 1. Fetch raw data from backend
        const [ordersRes, productsRes] = await Promise.all([
          apiClient.get("/orders").catch(() => []),
          apiClient.get("/products").catch(() => []),
        ]);

        const rawOrders = Array.isArray(ordersRes)
          ? ordersRes
          : ordersRes.data || [];
        const rawProducts = Array.isArray(productsRes)
          ? productsRes
          : productsRes.data || [];

        // 2. Map Product IDs to their standardized categories
        const categoryMap = {};
        rawProducts.forEach((p) => {
          const id = p._id || p.id;
          let cat = p.category ? p.category.toLowerCase() : "other";
          // Normalize to expected D3 keys
          if (cat.includes("romance")) categoryMap[id] = "Romance";
          else if (cat.includes("self") || cat.includes("help"))
            categoryMap[id] = "SelfHelp";
          else if (cat.includes("sci") || cat.includes("fiction"))
            categoryMap[id] = "SciFi";
          else if (cat.includes("history")) categoryMap[id] = "History";
          else categoryMap[id] = "Romance"; // Default fallback to prevent chart breaks
        });

        // 3. Prepare Time/Aggregation Variables
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        let totalOrdersThisMonth = 0;
        let totalSalesThisMonth = 0;

        const categorySalesThisMonth = {
          Romance: 0,
          SelfHelp: 0,
          SciFi: 0,
          History: 0,
        };

        // Setup last 6 months structure for charts
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const lineChartMap = {};
        const barChartMap = {};

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
          let m = currentMonth - i;
          if (m < 0) m += 12;
          const monthLabel = monthNames[m];
          lineChartMap[monthLabel] = {
            month: monthLabel,
            Romance: 0,
            SelfHelp: 0,
            SciFi: 0,
            History: 0,
          };
          barChartMap[monthLabel] = {
            month: monthLabel,
            Romance: 0,
            SelfHelp: 0,
            SciFi: 0,
            History: 0,
          };
        }

        // 4. Process Orders
        rawOrders.forEach((order) => {
          if (order.status === "cancelled") return; // Ignore cancelled orders

          const orderDate = new Date(order.createdAt);
          if (isNaN(orderDate.getTime())) return;

          const orderMonthIdx = orderDate.getMonth();
          const orderMonthLabel = monthNames[orderMonthIdx];

          const isCurrentMonth =
            orderMonthIdx === currentMonth &&
            orderDate.getFullYear() === currentYear;
          const orderTotal = parseDecimal128(order.total_amount);

          if (isCurrentMonth) {
            totalOrdersThisMonth += 1;
            totalSalesThisMonth += orderTotal;
          }

          // Process Order Items
          if (Array.isArray(order.order_item)) {
            order.order_item.forEach((item) => {
              const bookCat = categoryMap[item.book_id] || "Romance"; // Fallback if missing
              const itemQty = item.quantity || 1;
              const itemPrice = parseDecimal128(item.price);
              const itemRevenue = itemQty * itemPrice;

              if (isCurrentMonth) {
                categorySalesThisMonth[bookCat] += itemRevenue;
              }

              // Only populate charts if order fell within the initialized last 6 months
              if (lineChartMap[orderMonthLabel]) {
                lineChartMap[orderMonthLabel][bookCat] += itemQty;
                barChartMap[orderMonthLabel][bookCat] += itemRevenue;
              }
            });
          }
        });

        // 5. Format Data for D3
        // Format Donut Chart (Percentages)
        const donutChart = Object.keys(categorySalesThisMonth)
          .map((cat) => ({
            category:
              cat === "SelfHelp"
                ? "Self help"
                : cat === "SciFi"
                  ? "Sci fi"
                  : cat,
            value:
              totalSalesThisMonth > 0
                ? Math.round(
                    (categorySalesThisMonth[cat] / totalSalesThisMonth) * 100,
                  )
                : 0,
            color: categoryColors[cat],
          }))
          .filter((item) => item.value > 0);

        // Calculate Gauge
        const gaugeTarget =
          totalSalesThisMonth > 0
            ? (totalSalesThisMonth / targetMonthlySales) * 100
            : 0;

        setDashboardData({
          kpi: {
            orders: totalOrdersThisMonth,
            sales: new Intl.NumberFormat("th-TH", {
              style: "currency",
              currency: "THB",
              maximumFractionDigits: 0,
            }).format(totalSalesThisMonth),
          },
          donutChart,
          lineChart: Object.values(lineChartMap),
          barChart: Object.values(barChartMap),
          gaugeTarget,
        });
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndAggregateData();
  }, []);

  if (loading) {
    return (
      <div className="p-10 flex justify-center text-xl font-bold text-gray-500">
        Loading Dashboard...
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-10 flex justify-center text-xl font-bold text-red-500">
        Failed to load data.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-screen-2xl mx-auto bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 gap-y-8">
        {/* TOP ROW */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start">
          <div className="bg-white border-[3px] border-black p-5 text-center shadow-sm">
            <h2 className="text-xl font-bold mb-2">
              Total order in this month
            </h2>
            <p className="text-5xl lg:text-6xl font-normal font-serif text-[#5C1616]">
              {dashboardData.kpi.orders}
            </p>
          </div>
          <div className="bg-white border-[3px] border-black p-5 text-center shadow-sm">
            <h2 className="text-xl font-bold mb-2">
              Total sales in this month
            </h2>
            <p className="text-4xl lg:text-5xl font-normal font-serif text-[#5C1616]">
              {dashboardData.kpi.sales}
            </p>
          </div>
        </div>

        <div className="col-span-1 flex flex-col items-center justify-start text-center">
          <h2 className="text-lg lg:text-xl font-bold mb-2 w-64 leading-tight">
            Product sales by category in this month
          </h2>
          {dashboardData.donutChart.length > 0 ? (
            <DonutChart data={dashboardData.donutChart} />
          ) : (
            <p className="text-gray-400 my-10">No sales data this month</p>
          )}
        </div>

        {/* BOTTOM ROW */}
        <div className="col-span-1 flex flex-col items-center text-center">
          <h2 className="text-lg lg:text-xl font-bold mb-4 w-64 leading-tight">
            Product orders by categories and months
          </h2>
          <LineChart data={dashboardData.lineChart} />
        </div>

        <div className="col-span-1 flex flex-col items-center text-center">
          <h2 className="text-lg lg:text-xl font-bold mb-4 w-64 leading-tight">
            Product sales by categories and months
          </h2>
          <BarChart data={dashboardData.barChart} />
        </div>

        <div className="col-span-1 flex flex-col items-center justify-end text-center h-full">
          <h2 className="text-lg lg:text-xl font-bold mb-4">
            Monthly sales target (
            {new Intl.NumberFormat("th-TH").format(targetMonthlySales)} THB)
          </h2>
          <GaugeChart value={dashboardData.gaugeTarget} />
        </div>
      </div>
    </div>
  );
}
