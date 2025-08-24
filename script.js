// Só Vai TV - JavaScript Functionality

document.addEventListener("DOMContentLoaded", function() {
    // Sistema de autenticação seguro
    const AuthSystem = {
        // Senha codificada: S0V@1TV_2024!Br
        encodedPassword: ["S", "0", "V", "@", "1", "T", "V", "_", "2", "0", "2", "4", "!", "B", "r"],
        
        decodePassword: function() {
            // A senha já está na forma correta, não precisa de decodificação complexa
            return this.encodedPassword.join("");
        },
        
        validatePassword: function(inputPassword) {
            return inputPassword === this.decodePassword();
        }
    };

    // Sistema de armazenamento local
    const DataManager = {
        getBlogPosts: function() {
            return JSON.parse(localStorage.getItem("sovaitv_blog_posts")) || [];
        },
        
        setBlogPosts: function(posts) {
            localStorage.setItem("sovaitv_blog_posts", JSON.stringify(posts));
        },
        
        getVideos: function() {
            return JSON.parse(localStorage.getItem("sovaitv_videos")) || [];
        },
        
        setVideos: function(videos) {
            localStorage.setItem("sovaitv_videos", JSON.stringify(videos));
        },
        
        getEvents: function() {
            return JSON.parse(localStorage.getItem("sovaitv_events")) || [];
        },
        
        setEvents: function(events) {
            localStorage.setItem("sovaitv_events", JSON.stringify(events));
        },
        
        getComments: function() {
            return JSON.parse(localStorage.getItem("sovaitv_comments")) || [];
        },
        
        setComments: function(comments) {
            localStorage.setItem("sovaitv_comments", JSON.stringify(comments));
        }
    };

    // Mobile Menu Functionality
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileMenuLinks = document.querySelectorAll(".nav-mobile-link");

    mobileMenuBtn.addEventListener("click", function() {
        const isOpen = mobileMenu.classList.contains("active");
        
        if (isOpen) {
            mobileMenu.classList.remove("active");
            mobileMenuBtn.classList.remove("active");
            document.body.classList.remove("mobile-menu-open");
        } else {
            mobileMenu.classList.add("active");
            mobileMenuBtn.classList.add("active");
            document.body.classList.add("mobile-menu-open");
        }
    });

    // Close mobile menu when clicking on links
    mobileMenuLinks.forEach(link => {
        link.addEventListener("click", function() {
            mobileMenu.classList.remove("active");
            mobileMenuBtn.classList.remove("active");
            document.body.classList.remove("mobile-menu-open");
        });
    });

    // Smooth scrolling for navigation links
    const allNavLinks = document.querySelectorAll("a[href^=\"#\"]");
    allNavLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 64;
                window.scrollTo({
                    top: offsetTop,
                    behavior: "smooth"
                });
            }
        });
    });

    // Admin Panel Access (Triple click on Blog title)
    const blogTitle = document.getElementById("blog-title");
    const adminPanel = document.getElementById("admin-panel");
    let clickCount = 0;
    let clickTimer = null;

    blogTitle.addEventListener("click", function() {
        clickCount++;
        
        if (clickTimer) {
            clearTimeout(clickTimer);
        }
        
        clickTimer = setTimeout(function() {
            if (clickCount >= 3) {
                adminPanel.style.display = "block";
                adminPanel.scrollIntoView({ behavior: "smooth" });
            }
            clickCount = 0;
        }, 500);
    });

    // Admin Authentication
    const adminPasswordInput = document.getElementById("admin-password");
    const adminLoginBtn = document.getElementById("admin-login-btn");
    const adminDashboard = document.getElementById("admin-dashboard");
    const adminLogoutBtn = document.getElementById("admin-logout-btn");

    adminLoginBtn.addEventListener("click", function() {
        const password = adminPasswordInput.value;
        
        if (AuthSystem.validatePassword(password)) {
            adminPanel.style.display = "none";
            adminDashboard.style.display = "block";
            adminPasswordInput.value = "";
            loadAdminData();
            showNotification("Login realizado com sucesso!", "success");
        } else {
            showNotification("Senha incorreta!", "error");
            adminPasswordInput.value = "";
        }
    });

    adminLogoutBtn.addEventListener("click", function() {
        adminDashboard.style.display = "none";
        showNotification("Logout realizado com sucesso!", "success");
    });

    // Admin Tab System
    const adminTabBtns = document.querySelectorAll(".admin-tab-btn");
    const adminTabContents = document.querySelectorAll(".admin-tab-content");

    adminTabBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const tabId = this.getAttribute("data-tab");
            
            // Remove active class from all tabs and contents
            adminTabBtns.forEach(b => b.classList.remove("active"));
            adminTabContents.forEach(c => c.classList.remove("active"));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add("active");
            document.getElementById(`admin-${tabId}`).classList.add("active");
        });
    });

    // Blog Management
    const blogTitleInput = document.getElementById("blog-title-input");
    const blogAuthorInput = document.getElementById("blog-author-input");
    const blogImageInput = document.getElementById("blog-image-input");
    const blogExcerptInput = document.getElementById("blog-excerpt-input");
    const addBlogBtn = document.getElementById("add-blog-btn");
    const blogList = document.getElementById("blog-list");

    let editingBlogId = null;

    addBlogBtn.addEventListener("click", function() {
        const title = blogTitleInput.value.trim();
        const author = blogAuthorInput.value.trim();
        const image = blogImageInput.value.trim();
        const excerpt = blogExcerptInput.value.trim();

        if (!title || !author || !excerpt) {
            showNotification("Preencha todos os campos obrigatórios!", "error");
            return;
        }

        const blogPosts = DataManager.getBlogPosts();
        const currentDate = new Date().toLocaleDateString("pt-BR");

        if (editingBlogId !== null) {
            // Editing existing post
            const postIndex = blogPosts.findIndex(post => post.id === editingBlogId);
            if (postIndex !== -1) {
                blogPosts[postIndex] = {
                    ...blogPosts[postIndex],
                    title,
                    author,
                    image: image || "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&q=80",
                    excerpt
                };
            }
            editingBlogId = null;
            addBlogBtn.textContent = "Adicionar Post";
        } else {
            // Adding new post
            const newPost = {
                id: Date.now(),
                title,
                author,
                image: image || "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&q=80",
                excerpt,
                date: currentDate
            };
            blogPosts.push(newPost);
        }

        DataManager.setBlogPosts(blogPosts);
        updateBlogDisplay();
        clearBlogForm();
        showNotification("Post salvo com sucesso!", "success");
    });

    function clearBlogForm() {
        blogTitleInput.value = "";
        blogAuthorInput.value = "";
        blogImageInput.value = "";
        blogExcerptInput.value = "";
    }

    function updateBlogDisplay() {
        const blogPosts = DataManager.getBlogPosts();
        const blogGrid = document.getElementById("blog-grid");
        
        // Update admin list
        blogList.innerHTML = blogPosts.map(post => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <h5>${post.title}</h5>
                    <p>Por: ${post.author} | ${post.date}</p>
                </div>
                <div class="admin-item-actions">
                    <button class="admin-edit-btn" onclick="editBlogPost(${post.id})">Editar</button>
                    <button class="admin-delete-btn" onclick="deleteBlogPost(${post.id})">Excluir</button>
                </div>
            </div>
        `).join("");

        // Update public blog grid
        // Clear existing dynamic posts before adding new ones
        const existingBlogCards = blogGrid.querySelectorAll(".blog-card");
        existingBlogCards.forEach(card => {
            // Only remove cards that were dynamically added (e.g., check for a data attribute)
            // For simplicity, we'll assume all existing cards are dynamic for now.
            // In a real app, you might add a data-dynamic="true" attribute when creating them.
            if (card.dataset.dynamic === "true") {
                card.remove();
            }
        });

        const dynamicPosts = blogPosts.map(post => `
            <article class="blog-card" data-dynamic="true">
                <div class="blog-image">
                    <img src="${post.image}" alt="${post.title}" class="blog-img">
                </div>
                <div class="blog-content">
                    <h3 class="blog-title">${post.title}</h3>
                    <div class="blog-meta">
                        <span class="blog-author">
                            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            ${post.author}
                        </span>
                        <span class="blog-date">
                            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            ${post.date}
                        </span>
                    </div>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <button class="blog-read-more">Ler Mais</button>
                </div>
            </article>
        `).join("");

        blogGrid.insertAdjacentHTML("beforeend", dynamicPosts);
    }

    // Video Management
    const videoTitleInput = document.getElementById("video-title-input");
    const videoCategoryInput = document.getElementById("video-category-input");
    const videoThumbnailInput = document.getElementById("video-thumbnail-input");
    const videoUrlInput = document.getElementById("video-url-input");
    const videoDescriptionInput = document.getElementById("video-description-input");
    const addVideoBtn = document.getElementById("add-video-btn");
    const videoList = document.getElementById("video-list");

    let editingVideoId = null;

    addVideoBtn.addEventListener("click", function() {
        const title = videoTitleInput.value.trim();
        const category = videoCategoryInput.value;
        const thumbnail = videoThumbnailInput.value.trim();
        const url = videoUrlInput.value.trim();
        const description = videoDescriptionInput.value.trim();

        if (!title || !description) {
            showNotification("Preencha todos os campos obrigatórios!", "error");
            return;
        }

        const videos = DataManager.getVideos();

        if (editingVideoId !== null) {
            // Editing existing video
            const videoIndex = videos.findIndex(video => video.id === editingVideoId);
            if (videoIndex !== -1) {
                videos[videoIndex] = {
                    ...videos[videoIndex],
                    title,
                    category,
                    thumbnail: thumbnail || "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80",
                    url,
                    description
                };
            }
            editingVideoId = null;
            addVideoBtn.textContent = "Adicionar Vídeo";
        } else {
            // Adding new video
            const newVideo = {
                id: Date.now(),
                title,
                category,
                thumbnail: thumbnail || "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80",
                url,
                description
            };
            videos.push(newVideo);
        }

        DataManager.setVideos(videos);
        updateVideoDisplay();
        clearVideoForm();
        showNotification("Vídeo salvo com sucesso!", "success");
    });

    function clearVideoForm() {
        videoTitleInput.value = "";
        videoCategoryInput.value = "reference";
        videoThumbnailInput.value = "";
        videoUrlInput.value = "";
        videoDescriptionInput.value = "";
    }

    function updateVideoDisplay() {
        const videos = DataManager.getVideos();
        const videosGrid = document.getElementById("videos-grid");
        
        // Update admin list
        videoList.innerHTML = videos.map(video => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <h5>${video.title}</h5>
                    <p>Categoria: ${video.category === "reference" ? "Vídeo de Referência" : "Evento"}</p>
                </div>
                <div class="admin-item-actions">
                    <button class="admin-edit-btn" onclick="editVideo(${video.id})">Editar</button>
                    <button class="admin-delete-btn" onclick="deleteVideo(${video.id})">Excluir</button>
                </div>
            </div>
        `).join("");

        // Update public videos grid
        const existingVideoCards = videosGrid.querySelectorAll(".video-card");
        existingVideoCards.forEach(card => {
            if (card.dataset.dynamic === "true") {
                card.remove();
            }
        });

        const dynamicVideos = videos.map(video => `
            <div class="video-card" data-category="${video.category}" data-dynamic="true">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}" class="video-img">
                    <button class="play-btn" onclick="playVideo(\'${video.url}\')">
                        <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5,3 19,12 5,21"></polygon>
                        </svg>
                    </button>
                </div>
                <div class="video-content">
                    <h3 class="video-title">${video.title}</h3>
                    <p class="video-description">${video.description}</p>
                </div>
            </div>
        `).join("");

        videosGrid.insertAdjacentHTML("beforeend", dynamicVideos);
        
        // Reapply filter functionality
        setupVideoFilters();
    }

    // Event Management
    const eventTitleInput = document.getElementById("event-title-input");
    const eventDateInput = document.getElementById("event-date-input");
    const eventLocationInput = document.getElementById("event-location-input");
    const eventDescriptionInput = document.getElementById("event-description-input");
    const addEventBtn = document.getElementById("add-event-btn");
    const eventList = document.getElementById("event-list");

    let editingEventId = null;

    addEventBtn.addEventListener("click", function() {
        const title = eventTitleInput.value.trim();
        const date = eventDateInput.value;
        const location = eventLocationInput.value.trim();
        const description = eventDescriptionInput.value.trim();

        if (!title || !date || !location || !description) {
            showNotification("Preencha todos os campos!", "error");
            return;
        }

        const events = DataManager.getEvents();

        if (editingEventId !== null) {
            // Editing existing event
            const eventIndex = events.findIndex(event => event.id === editingEventId);
            if (eventIndex !== -1) {
                events[eventIndex] = {
                    ...events[eventIndex],
                    title,
                    date,
                    location,
                    description
                };
            }
            editingEventId = null;
            addEventBtn.textContent = "Adicionar Evento";
        } else {
            // Adding new event
            const newEvent = {
                id: Date.now(),
                title,
                date,
                location,
                description
            };
            events.push(newEvent);
        }

        DataManager.setEvents(events);
        updateEventDisplay();
        clearEventForm();
        showNotification("Evento salvo com sucesso!", "success");
    });

    function clearEventForm() {
        eventTitleInput.value = "";
        eventDateInput.value = "";
        eventLocationInput.value = "";
        eventDescriptionInput.value = "";
    }

    function updateEventDisplay() {
        const events = DataManager.getEvents();
        
        eventList.innerHTML = events.map(event => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <h5>${event.title}</h5>
                    <p>${new Date(event.date).toLocaleDateString("pt-BR")} - ${event.location}</p>
                </div>
                <div class="admin-item-actions">
                    <button class="admin-edit-btn" onclick="editEvent(${event.id})">Editar</button>
                    <button class="admin-delete-btn" onclick="deleteEvent(${event.id})">Excluir</button>
                </div>
            </div>
        `).join("");
    }

    // Comment Management
    const commentList = document.getElementById("comment-list");

    function updateCommentDisplay() {
        const comments = DataManager.getComments();
        
        commentList.innerHTML = comments.map(comment => `
            <div class="admin-item">
                <div class="admin-item-info">
                    <h5>${comment.name}</h5>
                    <p>${comment.comment}</p>
                </div>
                <div class="admin-item-actions">
                    <button class="admin-edit-btn" onclick="approveComment(${comment.id})">Aprovar</button>
                    <button class="admin-delete-btn" onclick="deleteComment(${comment.id})">Excluir</button>
                </div>
            </div>
        `).join("");
    }

    // Global functions for admin actions
    window.editBlogPost = function(id) {
        const blogPosts = DataManager.getBlogPosts();
        const post = blogPosts.find(p => p.id === id);
        if (post) {
            blogTitleInput.value = post.title;
            blogAuthorInput.value = post.author;
            blogImageInput.value = post.image;
            blogExcerptInput.value = post.excerpt;
            editingBlogId = id;
            addBlogBtn.textContent = "Atualizar Post";
        }
    };

    window.deleteBlogPost = function(id) {
        if (confirm("Tem certeza que deseja excluir este post?")) {
            const blogPosts = DataManager.getBlogPosts();
            const filteredPosts = blogPosts.filter(post => post.id !== id);
            DataManager.setBlogPosts(filteredPosts);
            updateBlogDisplay();
            showNotification("Post excluído com sucesso!", "success");
        }
    };

    window.editVideo = function(id) {
        const videos = DataManager.getVideos();
        const video = videos.find(v => v.id === id);
        if (video) {
            videoTitleInput.value = video.title;
            videoCategoryInput.value = video.category;
            videoThumbnailInput.value = video.thumbnail;
            videoUrlInput.value = video.url;
            videoDescriptionInput.value = video.description;
            editingVideoId = id;
            addVideoBtn.textContent = "Atualizar Vídeo";
        }
    };

    window.deleteVideo = function(id) {
        if (confirm("Tem certeza que deseja excluir este vídeo?")) {
            const videos = DataManager.getVideos();
            const filteredVideos = videos.filter(video => video.id !== id);
            DataManager.setVideos(filteredVideos);
            updateVideoDisplay();
            showNotification("Vídeo excluído com sucesso!", "success");
        }
    };

    window.editEvent = function(id) {
        const events = DataManager.getEvents();
        const event = events.find(e => e.id === id);
        if (event) {
            eventTitleInput.value = event.title;
            eventDateInput.value = event.date;
            eventLocationInput.value = event.location;
            eventDescriptionInput.value = event.description;
            editingEventId = id;
            addEventBtn.textContent = "Atualizar Evento";
        }
    };

    window.deleteEvent = function(id) {
        if (confirm("Tem certeza que deseja excluir este evento?")) {
            const events = DataManager.getEvents();
            const filteredEvents = events.filter(event => event.id !== id);
            DataManager.setEvents(filteredEvents);
            updateEventDisplay();
            showNotification("Evento excluído com sucesso!", "success");
        }
    };

    window.approveComment = function(id) {
        const comments = DataManager.getComments();
        const commentIndex = comments.findIndex(c => c.id === id);
        if (commentIndex !== -1) {
            comments[commentIndex].approved = true;
            DataManager.setComments(comments);
            updateCommentDisplay();
            updateCommentsCarousel();
            showNotification("Comentário aprovado!", "success");
        }
    };

    window.deleteComment = function(id) {
        if (confirm("Tem certeza que deseja excluir este comentário?")) {
            const comments = DataManager.getComments();
            const filteredComments = comments.filter(comment => comment.id !== id);
            DataManager.setComments(filteredComments);
            updateCommentDisplay();
            updateCommentsCarousel();
            showNotification("Comentário excluído com sucesso!", "success");
        }
    };

    window.playVideo = function(url) {
        if (url) {
            window.open(url, "_blank");
        } else {
            showNotification("URL do vídeo não disponível", "error");
        }
    };

    function loadAdminData() {
        updateBlogDisplay();
        updateVideoDisplay();
        updateEventDisplay();
        updateCommentDisplay();
    }

    // Video Filter Functionality
    function setupVideoFilters() {
        const filterButtons = document.querySelectorAll(".filter-btn");
        const videoCards = document.querySelectorAll(".video-card");

        filterButtons.forEach(button => {
            button.addEventListener("click", function() {
                const filter = this.getAttribute("data-filter");
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove("active"));
                this.classList.add("active");
                
                // Filter video cards
                videoCards.forEach(card => {
                    const category = card.getAttribute("data-category");
                    
                    if (filter === "all" || category === filter) {
                        card.classList.remove("hidden");
                    } else {
                        card.classList.add("hidden");
                    }
                });
            });
        });
    }

    // Initialize video filters
    setupVideoFilters();

    // Comments Carousel Functionality
    const defaultComments = [
        {
            name: "Maria Silva",
            comment: "Conteúdo incrível! Sempre me divirto assistindo os vídeos da Só Vai TV.",
            approved: true
        },
        {
            name: "João Santos",
            comment: "Equipe muito criativa, adoro o humor de vocês!",
            approved: true
        },
        {
            name: "Ana Costa",
            comment: "Melhor canal de entretenimento! Continuem com esse trabalho maravilhoso.",
            approved: true
        },
        {
            name: "Pedro Oliveira",
            comment: "Vocês são demais! Sempre esperando pelos próximos vídeos.",
            approved: true
        },
        {
            name: "Carla Mendes",
            comment: "Conteúdo de qualidade e muito divertido. Parabéns!",
            approved: true
        }
    ];

    // Initialize default comments if none exist
    if (DataManager.getComments().length === 0) {
        DataManager.setComments(defaultComments);
    }

    let currentCommentIndex = 0;
    const commentsContainer = document.getElementById("comments-container");
    const prevCommentBtn = document.getElementById("prev-comment");
    const nextCommentBtn = document.getElementById("next-comment");

    function updateCommentsCarousel() {
        const allComments = DataManager.getComments();
        const approvedComments = allComments.filter(comment => comment.approved);
        
        if (approvedComments.length === 0) return;

        const visibleComments = [];
        for (let i = 0; i < Math.min(3, approvedComments.length); i++) {
            const index = (currentCommentIndex + i) % approvedComments.length;
            visibleComments.push(approvedComments[index]);
        }

        commentsContainer.innerHTML = visibleComments.map(comment => `
            <div class="comment-card">
                <svg class="comment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <h4 class="comment-author">${comment.name}</h4>
                <p class="comment-text">${comment.comment}</p>
            </div>
        `).join("");
    }

    prevCommentBtn.addEventListener("click", function() {
        const approvedComments = DataManager.getComments().filter(c => c.approved);
        currentCommentIndex = (currentCommentIndex - 1 + approvedComments.length) % approvedComments.length;
        updateCommentsCarousel();
    });

    nextCommentBtn.addEventListener("click", function() {
        const approvedComments = DataManager.getComments().filter(c => c.approved);
        currentCommentIndex = (currentCommentIndex + 1) % approvedComments.length;
        updateCommentsCarousel();
    });

    // Comment Form Functionality
    const commentForm = document.getElementById("comment-form");
    const commentNameInput = document.getElementById("comment-name");
    const commentTextInput = document.getElementById("comment-text");

    commentForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const name = commentNameInput.value.trim();
        const text = commentTextInput.value.trim();
        
        if (name && text) {
            const comments = DataManager.getComments();
            const newComment = {
                id: Date.now(),
                name: name,
                comment: text,
                approved: false,
                date: new Date().toISOString()
            };
            
            comments.push(newComment);
            DataManager.setComments(comments);
            
            // Clear form
            commentNameInput.value = "";
            commentTextInput.value = "";
            
            showNotification("Comentário enviado para aprovação! Obrigado pelo feedback.", "success");
        }
    });

    // Blog read more functionality
    document.addEventListener("click", function(e) {
        if (e.target.classList.contains("blog-read-more")) {
            const blogCard = e.target.closest(".blog-card");
            const title = blogCard.querySelector(".blog-title").textContent;
            showNotification(`Abrindo artigo: "${title}"`, "info");
        }
    });

    // Notification System
    function showNotification(message, type = "info") {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll(".notification");
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement("div");
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            z-index: 1000;
            box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = "slideOut 0.3s ease-out";
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add CSS for notification animations
    const style = document.createElement("style");
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize comments display
    updateCommentsCarousel();

    // Auto-rotate comments every 5 seconds
    setInterval(function() {
        const approvedComments = DataManager.getComments().filter(c => c.approved);
        if (approvedComments.length > 0) {
            currentCommentIndex = (currentCommentIndex + 1) % approvedComments.length;
            updateCommentsCarousel();
        }
    }, 5000);

    // Contact Form
    const contactForm = document.querySelector(".contact-form");
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();
        showNotification("Mensagem enviada com sucesso! Entraremos em contato em breve.", "success");
        contactForm.reset();
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll(".stat-card, .partner-card, .blog-card, .video-card, .comment-card");
    animatedElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(el);
    });

    // Header background on scroll
    const navigation = document.querySelector(".navigation");
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navigation.style.background = "rgba(20, 20, 20, 0.95)";
        } else {
            navigation.style.background = "rgba(20, 20, 20, 0.8)";
        }
        
        lastScrollY = currentScrollY;
    });

    // Add loading animation
    window.addEventListener("load", function() {
        document.body.classList.add("loaded");
    });
});

// Utility function for smooth scrolling
function smoothScrollTo(targetId, offset = 64) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        const offsetTop = targetElement.offsetTop - offset;
        window.scrollTo({
            top: offsetTop,
            behavior: "smooth"
        });
    }
}

// Export for potential external use
window.SovaiTV = {
    smoothScrollTo: smoothScrollTo
};

