var gameInstance = UnityLoader.instantiate("gameContainer", "Build/InFraReD.json", { onProgress: UnityProgress });

function UnityProgress(gameInstance, progress) {
    if (!gameInstance.Module) {
        return;
    }
    const loader = document.querySelector("#loader");
    if (!gameInstance.progress) {

        const progress = document.querySelector("#loader .progress");
        progress.style.display = "block";
        gameInstance.progress = progress.querySelector(".full");
        loader.querySelector(".spinner").style.display = "none";

    }
    gameInstance.progress.style.transform = `scaleX(${progress})`;
    // document.body.classList.add("notInteractable");
    if (progress === 1 && !gameInstance.removeTimeout) {
        //document.body.classList.add("interactable");
        //document.body.style.cursor = "default";
        //document.body.style.removeProperty("pointer-events");
        //document.body.style.removeProperty("cursor");
        gameInstance.removeTimeout = setTimeout(function () {
            loader.style.display = "none";
           
            //document.getElementById("loadBlockWrapper").classList.add("hidden");
            document.removeEventListener('click', blocker, true);
        }, 2000);
    }
}