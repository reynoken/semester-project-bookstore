import { Chart, Legend, Title, Tooltip } from "chart.js"

Chart.register(Legend, Title, Tooltip)

Chart.defaults.color = "#6f6583"
Chart.defaults.borderColor = "rgba(147, 161, 161, 0.25)"
Chart.defaults.font.family = "'sans-serif'"
Chart.defaults.font.size = 14
Chart.defaults.font.lineHeight = 1.5
Chart.defaults.layout.padding = 15
Chart.defaults.plugins.legend.position = "bottom"
Chart.defaults.plugins.title.display = true
Chart.defaults.plugins.title.padding = 16
