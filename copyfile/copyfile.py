# -*- coding: utf-8 -*-
#!/usr/bin/python
#Filename:copyfile.py
import os,shutil
def mycopy(srcpath,dstpath):
    if not os.path.exists(srcpath):
        print ("srcpath not exist!")
    if not os.path.exists(dstpath):
        print ("dstpath not exist!")
    for root,dirs,files in os.walk(srcpath,True):
        for eachfile in files:
            #shutil.copy(os.path.join(root,eachfile),dstpath)
            shutil.move(os.path.join(root,eachfile),dstpath)
            
srcpath='G:\\MY\\2017\\iPhone'
dstpath='G:\\MY\\2017\\iPhoneOut5'
mycopy(srcpath,dstpath)
