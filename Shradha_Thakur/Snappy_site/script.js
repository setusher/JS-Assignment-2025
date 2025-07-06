// fetch('http://43.205.110.71:8000/health')
//   .then(res => res.text())
//   .then(console.log);


//array me store karenge
//search how to use window for storing
let allCategories=[];
let allItems = [];

function applyFilter(){
    const cateogry = document.querySelector('.categories select').value;
    const tag = document.querySelector('.tags select').value;

    const filtered = allItems.filter(item=>{
        const matchesCategory = cateogry === 'all' || item.category === cateogry;
        const matchesTag = tag === 'all' || item.tags.split('|').includes(tag);
        return matchesCategory && matchesTag;
    });
    getItems(filtered);
}


async function fetchCatg(){
    const res = await fetch('http://43.205.110.71:8000/categories')
    const data = await res.json();
    console.log(data);

    const catSelect = document.querySelector('.categories select');
    catSelect.addEventListener('change', applyFilter);

    const tagSelect = document.querySelector('.tags select');
    tagSelect.addEventListener('change', applyFilter);
}


async function getItems(items){
    const container = document.getElementById('items-container');
    container.innerHTML = '';
    items.forEach(item => {
        const itemcard = document.createElement('div');
        itemcard.classList.add('item-card');
        itemcard.innerHTML = `
            <img src="https://picsum.photos/200?random=${item.id}" alt="Item">
            <h3>${item.name}</h3>
            <p>${item.description}<br>
            Price: ${item.price}<br>
            Tags: ${item.tags}</p>
        `;
        container.appendChild(itemcard);
    })
}

async function fetchAllData(){
    const [catres, itemres] = await Promise.all([
        fetch('http://43.205.110.71:8000/categories'),
        fetch('http://43.205.110.71:8000/items')
    ]);
    
    allCategories = await catres.json();
    allItems = await itemres.json();
    getItems(allItems);


}

window.onload = () => {
    fetchCatg();
    fetchAllData();
}

//ask use of other apis
//promise.all ke alawa what tricks for fast loading 
