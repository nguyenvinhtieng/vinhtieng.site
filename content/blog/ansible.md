---
title: "Tổng quan và cấu hình Ansible" 
description: "Hướng dẫn chi tiết về cài đặt, cấu hình SSH, inventory và sử dụng Playbook trong Ansible." 
tags: ["ansible"] 
image: "/images/blog/ansible/banner.png" 
date: 2025-04-25 
published: true
---

**Hướng dẫn chi tiết về cài đặt và triển khai Ansible**

Ansible là một công cụ tự động hóa mạnh mẽ, giúp quản lý cấu hình, triển khai ứng dụng và điều phối hệ thống một cách dễ dàng. Trong bài viết này, chúng ta sẽ tìm hiểu cách cài đặt, cấu hình và sử dụng Ansible thông qua các ví dụ thực tế.

---

# 🛠️ Cài đặt Ansible

Hướng dẫn cài đặt Ansible trên Ubuntu:

::code-block
---
files:
  - title: bash
    language: bash
    content: |
      sudo apt update -y
      sudo apt install software-properties-common -y
      sudo apt-add-repository --yes --update ppa:ansible/ansible
      sudo apt install ansible -y
---
::

Sau khi cài đặt, bạn có thể kiểm tra phiên bản Ansible:

::code-block
---
files:
  - title: bash
    language: bash
    content: ansible --version
---
::

---

# 🔑 Cấu hình SSH

Để Ansible có thể kết nối đến các máy chủ từ xa, bạn cần cấu hình SSH. Dưới đây là cách sao chép SSH key đến máy chủ khác:

::code-block
---
files:
  - title: bash
    language: bash
    content: ssh-copy-id -i ~/.ssh/id_rsa.pub vinhtieng@123.3123.12
---
::

**Lưu ý:** Thay `vinhtieng@123.3123.12` bằng tên người dùng và địa chỉ IP của máy chủ từ xa.

---

# 📋 Hosts - Inventory

File inventory là nơi bạn định nghĩa danh sách các máy chủ mà Ansible sẽ quản lý. Đây là một ví dụ cơ bản:

::code-block
---
files:
  - title: inventory
    language: ini
    content: |
      [webservers]
      web1.example.com
      web2.example.com

      [databases]
      db1.example.com

      [webservers:vars]
      ansible_user=your_ssh_user
      ansible_ssh_private_key_file=/path/to/private/key

      [webservers1]
      web1.example.com ansible_user=user1 ansible_ssh_private_key_file=/path/to/key1
      web2.example.com ansible_user=user2 ansible_ssh_private_key_file=/path/to/key2
---
::

---

# 🏓 Kiểm tra kết nối (Ping)

Bạn có thể kiểm tra kết nối đến các máy chủ bằng lệnh `ping`:

1. **Ping với file hosts mặc định:**

::code-block
---
files:
  - title: bash
    language: bash
    content: ansible -m ping all
---
::

2. **Ping với file inventory tùy chỉnh:**

::code-block
---
files:
  - title: bash
    language: bash
    content: ansible -i my_hosts all -m ping
---
::

---

# 📜 Playbook - Task - Module

Playbook là nơi bạn định nghĩa các tác vụ (tasks) cần thực hiện trên các máy chủ. Dưới đây là cách chạy một playbook:

::code-block
---
files:
  - title: bash
    language: bash
    content: ansible-playbook my_playbook.yml -i inventory_file
---
::

**Ví dụ về Playbook đơn giản:**

::code-block
---
files:
  - title: my_playbook.yml
    language: yaml
    content: |
      ---
      - name: Cài đặt và khởi động Apache
        hosts: webservers
        become: yes
        tasks:
          - name: Cài đặt Apache
            apt:
              name: apache2
              state: present
          - name: Đảm bảo Apache đang chạy
            service:
              name: apache2
              state: started
---
::

---

# 📚 Tài liệu tham khảo

- [Ansible Documentation](https://docs.ansible.com/)
- [Ansible Galaxy](https://galaxy.ansible.com/)
- [Ansible Playbook Guide](https://docs.ansible.com/ansible/latest/user_guide/playbooks.html)

---

<br />

**Tóm lại:**

Ansible là công cụ mạnh mẽ giúp tự động hóa các tác vụ quản trị hệ thống. Việc nắm vững cách sử dụng Ansible sẽ giúp bạn tiết kiệm thời gian và giảm thiểu lỗi trong quá trình quản lý hệ thống.

