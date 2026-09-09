function helloWorld() {
  let elem = document.createElement("h1");
  elem.textContent = "Hello, world!";
  document.body.append(elem);
}

let btn = document.getElementById("hello-world-button");
btn?.addEventListener("click", helloWorld);
