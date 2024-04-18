function generateRandomPackageData() {
  const estados = ["En tránsito", "En almacén", "Entregado"];
  const ubicaciones = ["Ciudad A", "Ciudad B", "Ciudad C"];
  const tiempoEntrega = Math.floor(Math.random() * (20 - 4 + 1)) + 4;

  return {
    estado: estados[Math.floor(Math.random() * estados.length)],
    ubicacion: ubicaciones[Math.floor(Math.random() * ubicaciones.length)],
    tiempoEntrega: tiempoEntrega,
  };
}

function generatePackagesList(numPackages) {
  const packages = {};

  for (let i = 1; i <= numPackages; i++) {
    packages["paquete" + i] = generateRandomPackageData();
  }

  return packages;
}

const intervalIds = {};

function renderPackages(packages) {
  const packagesList = document.getElementById("packagesList");
  const eventLogElement = document.getElementById("eventLog");
  packagesList.innerHTML = "";

  for (let id in packages) {
    const packageData = packages[id];
    const packageElement = document.createElement("div");
    packageElement.classList.add("col-md-4", "mb-4");
    packageElement.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Paquete ${id}</h5>
                            <p class="card-text"><strong>Estado:</strong> ${
                              packageData.estado
                            }</p>
                            <p class="card-text"><strong>Ubicación:</strong> ${
                              packageData.ubicacion
                            }</p>
                            <div class="progress">
                                <div id="progress-${id}" class="progress-bar" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            ${
                              packageData.estado === "En almacén"
                                ? `<button id="startDeliveryBtn-${id}" class="btn btn-primary mt-3" onclick="startDelivery('${id}')">Iniciar Entrega</button>`
                                : ""
                            }
                        </div>
                    </div>
                `;
    packagesList.appendChild(packageElement);

    if (packageData.estado === "En tránsito") {
      const progressBar = document.getElementById(`progress-${id}`);
      // Solo iniciar el contador si no está ya iniciado
      if (!intervalIds[id]) {
        const totalTime = packageData.tiempoEntrega * 1000;
        let currentTime = totalTime;
        intervalIds[id] = setInterval(() => {
          currentTime -= 1000;
          const progress = (currentTime / totalTime) * 100;
          progressBar.style.width = `${progress}%`;
          if (currentTime <= 0) {
            clearInterval(intervalIds[id]);
            packageData.estado = "Entregado";
            renderPackages(packages);
            addToEventLog(
              `El paquete ${id} ha sido entregado.`,
              eventLogElement
            );
          }
        }, 1000);
      }
    }
  }
}

function startDelivery(id) {
  simulatedPackages[id].estado = "En tránsito";
  renderPackages(simulatedPackages);
  addToEventLog(`El paquete ${id} ha sido iniciado.`);
  document.getElementById(`startDeliveryBtn-${id}`).disabled = true;
}

const simulatedPackages = generatePackagesList(5);

const eventLog = [];

function addToEventLog(event, eventLogElement) {
  eventLog.push(event);
  renderEventLog(eventLogElement);
}

function renderEventLog(eventLogElement) {
  eventLogElement.innerHTML = "";
  eventLog.forEach((event) => {
    const eventElement = document.createElement("div");
    eventElement.textContent = event;
    eventLogElement.appendChild(eventElement);
  });
}

renderPackages(simulatedPackages);
