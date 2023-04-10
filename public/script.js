
        const root = document.getElementById('root');
        const err_msg = document.querySelector('.error-msg');
        const my_form = document.getElementById('my-form');
        const file = document.getElementById('filename');
        const text = document.getElementById('title');
        const des = document.getElementById('des');
        const t_body = document.querySelector('.t-body');
        const link = document.getElementById('link');
        const category = document.getElementById('category');
        let files;

        const fetchData = () => {
            fetch("https://calm-ruby-quail-veil.cyclic.app/data/posts")
            .then(res => res.json())
            .then(data => {
                createTR(data)
            })
        }
        fetchData();

        my_form.addEventListener('submit', e => {
            e.preventDefault();
            let userVal = text.value;
            let fileVal = file.value;
            let desVal = des.value;
            let linkVal = link.value;
            let categoryVal = category.value;
            console.log(desVal)
            if(!userVal || !fileVal) return createMsg("من فضلك تأكد من ملأ البيانات ", "orange");

            let formData = new FormData();
            Array.from(files).forEach(file => {
               formData.append('files', file, file.name);
            });

            formData.append(text.name, userVal);
            formData.append("age", "26");
            formData.append("text", desVal);
            formData.append('link', linkVal);
            formData.append('category', categoryVal);

            fetch("https://calm-ruby-quail-veil.cyclic.app/add-post", {
                method: 'post',
                body: formData
            }).then(res => {
                console.log(res.status)
                createMsg("تم إضافة المقال بنجاح", "green");
                fetchData();
                return res.json();
            })
            .then(data => console.log(data))
            .catch(err =>
                {
                    createMsg("العملية فشلت يوجد خطأ ", "red");
                    console.log(err)
                });

            
        });

        file.addEventListener('change', e => {
            files = e.target.files;
        })



        function createTR(data){
            t_body.innerHTML = '';
            let counter = 1;
            data.forEach(tr => {
                counter++;
                let trHtml = `
                <tr>
                <td>${counter}</td>
                <td>
                    <img src="./images/${tr.nameImage}" id="table-img" />
                </td>
                <td>${tr.title}</td>
                <td><a href="#">${tr.url}</a></td>
                <td>${tr.text.slice(0, 10)}...</td>
                <td><i class="fa-sharp fa-solid fa-pen-to-square"></i></td>
                <td>
                   <span data-link="https://calm-ruby-quail-veil.cyclic.app/del-post/${tr._id}" class="rm-btn">
                     <i class="fa-solid fa-trash-can"></i>
                   </span>
                </td>
            </tr>
                `;

                t_body.insertAdjacentHTML('beforeend', trHtml);
            });

            const delBtn = Array.from(document.querySelectorAll('.rm-btn'));
            delBtn.forEach(link => {
                link.addEventListener('click', e => {
                    let a = e.target.closest('.rm-btn');
                    let url = a.dataset.link;
                    fetch(url, {
                        method: "delete"
                    }).then(res => {
                        createMsg("تم حذف المقال بنجاح", "green");
                        fetchData();
                        return res.json();
                    })
                    .then(data => console.log(data))
                    .catch(err => console.error(err))
                })
            });
        }


        function createMsg(msg, color){
            let span = document.createElement('span');
            let msgText = document.createTextNode(msg);
            span.appendChild(msgText);
            err_msg.style.opacity = 1;
            err_msg.style.backgroundColor = color;
            err_msg.appendChild(span);

            setTimeout(() => {
                err_msg.innerHTML = "";
                err_msg.style.opacity = 0;
            }, 3000);
        }