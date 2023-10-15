document.addEventListener('DOMContentLoaded',()=>{
    const select = document.querySelector('#user-todo'),
          input = document.querySelector('#new-todo'),
          list = document.querySelector('#todo-list'),
          addBtn = document.querySelector('#add');
          
    let users=[];
    let posts = [];

    // отрисовка пользователей
    function getUser(){
        axios.get('https://jsonplaceholder.typicode.com/users')
        .then(res=>{
            let getUsers = res.data;
            
            select.innerHTML=``;
            getUsers.forEach((i)=>{
                const user = document.createElement('option');
                user.innerHTML = `${i.name}`
                select.append(user);
                users.push(i)
            })
            
        })
        .catch(err=>{
            alert(`Ошибка: ${err}`)
        })
    }      
    
    //отрисовка постов
    function getPosts(){
        axios.get('https://jsonplaceholder.typicode.com/posts')
        .then(res=>{
            const getPosts = res.data;
            list.innerHTML=``;
            getPosts.forEach(i=>{
                const post = document.createElement('li');
                post.classList.add('todo-list__item');
                posts.push(i);
                axios.get('https://jsonplaceholder.typicode.com/users').then(res=>{
                    let getUsers = res.data;
                    getUsers.forEach(item=>{
                        if(i.userId == item.id){
                            post.innerHTML=`
                                <input type="checkbox" id="check">
                                <p class="todo-list__item-text">${i.title} <span class="curs">by</span> <span class="bold">${item.name}</span></p> 
                                <img src="./img/del.svg" alt="" class="close">
                            `;
                            
                        }
                    })
                })
                
                list.append(post)
                
            })
        }) .catch(err=>{
            alert(`Ошибка: ${err}`)
        })
    }
    getUser();
    getPosts();
    
    

    //удаление поста
    list.addEventListener('click',(e)=>{
        const target = e.target;
        let btnsDelete = document.querySelectorAll('.close');
        let renderPosts = document.querySelectorAll('.todo-list__item');
        btnsDelete.forEach(i=>{
            
            if(target == i){
                //console.log(renderPosts)
                renderPosts.forEach((item,i)=>{
                    if(target.parentNode == item){
                        axios.delete(`https://jsonplaceholder.typicode.com/posts/${i}`).then(res=>{
                            posts.splice(i,1);
                        }).catch(err=>{
                            alert(`Ошибка ${err}`)
                        })
                        list.removeChild(target.parentNode);
                    }
                })
            }
        })
        
    })


    //добавление поста
    addBtn.addEventListener('click',(e)=>{
        e.preventDefault()
        if(input.value==''){
            alert('Пропишите задачу');
        } else {
            const post = document.createElement('li');
            post.classList.add('todo-list__item');
            post.innerHTML = `
                <input type="checkbox" id="check">
                <p class="todo-list__item-text">${input.value} <span class="curs">by</span> <span class="bold">${select.value}</span></p> 
                <img src="./img/del.svg" alt="" class="close">
            `;
            let user;
            users.forEach(i=>{
                if(i.name == select.value){
                    user = i.id;
                    console.log(user)
                }
            })
            list.prepend(post);
            posts.push({
                id: posts.length,
                title: input.value,
                userId: user
            })
            
            axios.post('https://jsonplaceholder.typicode.com/posts',{
                userId: user,
                title: input.value,
                id: --posts.length
            }).then(res=>{
                console.log(res)
            }).catch(err=>{
                list.removeChild(post);
                posts.pop();
                alert(`Ошибка ${err}`)
                
            })
        }
        
    })

    //изменение статуса

    list.addEventListener('click',(e)=>{
        let btnsStatus = document.querySelectorAll('#check');
        const target = e.target
        btnsStatus.forEach(i=>{
            if(target == i){
                i.parentNode.classList.toggle('checked');
                let listItem = i.parentNode;
                list.removeChild(listItem);
                list.append(listItem);
            }
        })
    })
})