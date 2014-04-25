{
    'targets': [
        {
            'target_name': 'ioctl',
            'sources': [ 'src/ioctl.cpp' ],
            'include_dirs': [
                '<!(node -e "require(\'nan\')")'
            ]
        }
    ]
}
