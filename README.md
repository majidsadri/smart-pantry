# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Smart Pantry Manager

The Smart Pantry Manager is a web application designed to help users efficiently manage their pantry, suggest recipes based on available ingredients, and create shopping lists. It allows users to track their pantry inventory, set dietary preferences, and explore new meal ideas while reducing food waste.

Smart Pantry Manager

## Project Overview

The Smart Pantry Manager provides users with a streamlined way to manage their pantry inventory, set dietary preferences, and receive meal suggestions based on what they already have. Users can add items to their pantry, view their current inventory, and get suggestions for recipes they can make. In addition, users can manage dietary restrictions for a healthier meal plan and keep track of grocery shopping lists.



npm install @mui/icons-material

npm install @mui/material @emotion/react @emotion/styled axios date-fns

npm install json-server --save-dev


sudo apt install python3-dev

sudo apt install python3-pip

pip install scikit-learn pandas requests kaggle flask  flask-cors scikit-learn pandas 

python3 app.py

npm run server

npm start

Google key:
Search engine ID:  105c5b600af644edc
API key: AIzaSyBwqPu9e7n8gkQBJozcuL5_UKN1pVsGqWk

https://www.pexels.com/
CqDXEkdz6MLbZaaVCye7GioUsuRrVaG2ATmIFeNHX3EF2o4gbpOPERao


EC2:

cat /etc/systemd/system/smart-pantry.service
[Unit]
Description=Smart Pantry Python Application
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/smart-pantry/backend
ExecStart=/home/ubuntu/smart-pantry/venv/bin/python3 /home/ubuntu/smart-pantry/backend/app.py
Restart=always

[Install]
WantedBy=multi-user.target



cat /etc/systemd/system/smart-pantry-server.service
[Unit]
Description=Smart Pantry Node Server
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/smart-pantry
ExecStart=/usr/bin/npm run server
Restart=always
Environment="PATH=/usr/bin:/home/ubuntu/smart-pantry/node_modules/.bin"
Environment="NODE_ENV=production"
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=smart-pantry-server

[Install]
WantedBy=multi-user.target



sudo systemctl status smart-pantry.service



-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAmLbEVwv4MUUYGomhv2mvCMU3yR4ctzb42PUtqqutVLgJM3loUHXgKh/EZkQ9
0abUoEd6E00fqTrkxkXQGcIDNymJLprMowZ+0gVAUOfuUhPIRU9qk8MyN9KWIQ0BI6tyTgULnZgG
hz4g9t9OLuXfdvHKIBYzqeC3mxEndggxYVWTsn1+qPxLeAE/qI3llWngGVMwoj4lSiNGgxja82MJ
0qN9HrEAHywOC5Z146CvvQPpWmakARLDSEktRen0v0wadSVuVU0KzR54q9RsInx3HMMTI+N9EfTd
Jf39KdE47yJyA3GlaiqY75WILjvZValRkchAr//1SwJVbE4OJWhyywIDAQABAoIBAHf3I3fqHDfA
OnYmZlzyzaCLJQ6lzBMVaRkuSYiIQqqJxBieqBaE8urEd8mKlDGM5/1dCQX+kP+lFzC2iQqjAVml
FHH7AwSSRq//lg24lNv/VFU2VNftABcgI/WkvJ9jwHCPwBc15PL7GHQ26bkntYs/1/Oq3Tz3HeT/
7croFrqJf775u0dduEy479RvyAyAsdcKamBQGqVP6HVToLfncTDq7XzdCzYRH60ORd84TTODUfCa
ELZaGMyplE+n0eKI451f3rGHnQN4YzlBDdK7CJpbNXOdUS3aVIBGOJzqQDqV4eaviibhYwnNY/n6
E9HhvhzgVZtq6bGWX3ZiM73+uokCgYEA6F0k62KE+2NuSFSbJBjTDv4i5flI49jieHW+2C49cLM9
kv5jggl5Nz/8nmpU+spXG38Tojky2dyTRXCLDLdOKeBMnuGsUGHQBN63SRBmiY2x7aXQ6ufeJXcM
ya9RFTL1GZGgLrFPcY2LQ1qNI4NqvojgwGl7AsyiBdWOaD6AvD8CgYEAqD+BHCc4AmcKxWq7+KAf
vkbPrba+krYLjiyPBcfizAEt9jhqsNVtWrmmgc4L4euYtoGV0jJaIWhRQxP1iT0HqQkbXLbAE8PQ
su8elWeeXLetrqPqHt2onUQwSvzmhJr+tz4mzs7gbNQDVA0Hu/PcXgE6v58fOppDAfMAGeZbFnUC
gYBdOtoQU3QVxTw/ayrgHdG5B0CLUyzqtl+Pg3ayGENwj4oaC1VznEd1YogCK5mzEjJHBwKiqR59
CSJRzykLThTfem5jpRpVGhmzioSxnRH3CNImDsy3I5cfIxgPZ/c5cTukKajCc0PzxJ3mxVMxt43B
qvu6V9gSNHahrqC3tLREUwKBgF4DplSiAaUuCRHJk6HZcAN2NCRgwlreyNQ4R+82A6B1ZEZ6vft0
N3gD12wfQ/qJGLua66oaIs0aKpZt970pUjd9dEG5iNlCiUMDZTadQRuUM8Qrqe53c/n1GXs9mF4u
8fhZDXxwk22chwOXiGPZX6FT1I0xEFVB0AGt1LekRe/lAoGAbdKMxFnjnBHz6rXYjWlAx5fRn541
mnWSWCxjCmBTBmUhUcNpXgnGOsBVlAEOn5kW6DqGXNSXicdgeqMeZ/y977ynG7Gnob60rL4dW0cr
yUoftiz38csWuL6ken2rmYOkcfrH+JNNgWGidjb/YRv0+274QU8joiMjyd2FhEuDggw=
-----END RSA PRIVATE KEY-----