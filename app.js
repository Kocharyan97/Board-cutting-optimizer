let currentBoardIndex = 1;
const scale = 0.2;
const rectanglesArray = [];

function addRectangles() {
  const widthInput = document.getElementById('width');
  const heightInput = document.getElementById('height');
  const quantityInput = document.getElementById('quantity');

  const width = parseInt(widthInput.value);
  const height = parseInt(heightInput.value);
  const quantity = parseInt(quantityInput.value);

  if (!validateInputs(width, height, quantity)) {
    return;
  }

  for (let i = 0; i < quantity; i++) {
    const boards = document.getElementById('boards');
    let foundBoard = false;

    for (let j = 0; j <= currentBoardIndex; j++) {
      const currentBoard = boards.querySelector(`.board[data-index="${j}"]`);
      if (currentBoard && fitsInCurrentBoard(currentBoard, width, height)) {
        foundBoard = true;
        const rectangle = createRectangle(width, height);
        const packedPosition = packRectangle(currentBoard, width, height);

        applyRectangleStyles(rectangle, packedPosition);
        rectanglesArray.push(rectangle);
        currentBoard.appendChild(rectangle);
        addToRectangleList(width, height);
        break;
      }
    }

    if (!foundBoard) {
      currentBoardIndex++;
      const newBoard = createNewBoard(currentBoardIndex);
      boards.appendChild(newBoard);

      const rectangle = createRectangle(width, height);
      const packedPosition = packRectangle(newBoard, width, height);

      applyRectangleStyles(rectangle, packedPosition);
      rectanglesArray.push(rectangle);
      newBoard.appendChild(rectangle);
      addToRectangleList(width, height);
    }
  }
  clearInputValues(widthInput, heightInput, quantityInput);
}

function validateInputs(width, height, quantity) {
  if (isNaN(width) || isNaN(height) || isNaN(quantity) || width < 1 || width > 1830 || height < 1 || height > 3630) {
    alert("Please enter valid values for width, height, and quantity.");
    return false;
  }

  return true;
}

function createNewBoard(index) {
  const board = document.createElement('div');
  board.className = 'board';
  board.setAttribute('data-index', index);
  return board;
}

function createRectangle(width, height) {
  const rectangle = document.createElement('div');
  rectangle.className = 'rectangle';
  rectangle.style.width = `${width * scale}px`;
  rectangle.style.height = `${height * scale}px`;
  return rectangle;
}

function applyRectangleStyles(rectangle, packedPosition) {
  rectangle.style.left = `${packedPosition.x}px`;
  rectangle.style.top = `${packedPosition.y}px`;
  rectangle.style.backgroundColor = getRandomColor();
}

function addToRectangleList(width, height) {
  const rectangleList = document.getElementById('rectanglesList');
  const rectangleContainer = document.createElement('div');
  rectangleContainer.className = 'rectangle-item';
  const rectangleDetails = document.createTextNode(`Width: ${width} cm, Height: ${height} cm`);
  rectangleContainer.appendChild(rectangleDetails);
  const deleteButton = createDeleteButton(() => deleteItem(rectangleContainer));
  rectangleContainer.appendChild(deleteButton);
  rectangleList.appendChild(rectangleContainer);
}

function createDeleteButton(onClickHandler) {
  const deleteButton = document.createElement('button');
  deleteButton.className = 'deleteBtn';
  deleteButton.textContent = 'Delete';
  deleteButton.onclick = onClickHandler;
  return deleteButton;
}

function deleteItem(itemContainer) {
  const index = Array.from(itemContainer.parentNode.children).indexOf(itemContainer);
  if (rectanglesArray.length > index) {
    const existingRectangle = rectanglesArray[index];
    existingRectangle.remove();
    rectanglesArray.splice(index, 1);
  }
  itemContainer.remove();
}

function fitsInCurrentBoard(board, width, height) {
  const rectangles = rectanglesArray.filter(rect => rect.parentNode === board);
  for (let y = 0; y <= board.clientHeight - height * scale; y++) {
    for (let x = 0; x <= board.clientWidth - width * scale; x++) {
      if (canPlaceRectangle(x, y, rectangles, width * scale, height * scale)) {
        return true;
      }
    }
  }

  return false;
}

function packRectangle(board, width, height) {
  const rectangles = rectanglesArray.filter(rect => rect.parentNode === board);

  for (let y = 0; y <= board.clientHeight - height * scale; y++) {
    for (let x = 0; x <= board.clientWidth - width * scale; x++) {
      if (canPlaceRectangle(x, y, rectangles, width * scale, height * scale)) {
        return { x, y };
      }
    }
  }
}

function canPlaceRectangle(x, y, rectangles, width, height) {
  for (const rect of rectangles) {
    const rectX = parseInt(rect.style.left);
    const rectY = parseInt(rect.style.top);
    const rectWidth = parseInt(rect.style.width);
    const rectHeight = parseInt(rect.style.height);

    if (rectX < x + width &&
        rectX + rectWidth > x &&
        rectY < y + height &&
        rectY + rectHeight > y) {
      return false;
    }
  }

  return true;
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function clearInputValues(...inputs) {
  inputs.forEach(input => input.value = "");
}
