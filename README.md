Simple server to bootstrap server with cloud-init and the datasource EC2 method

When testing on QEMU, your local address on the host bridge : 

    # start it
    sudo avahi-autoipd -S -D --force-bind 169.254.169.254 virbr0
    # stop it
    sudo avahi-autoipd -k virbr0

