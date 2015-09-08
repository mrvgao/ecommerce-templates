# -*- coding: cp936 -*-
#author SUM
import os,sys
def analyze(target_file,file_list):


        commentAll=0
        whiteAll=0
        normalAll=0
        for files in file_list:
            with open(files) as file:
                lines=file.readlines()
                file.close()
                target_file.write(file.name+"\n")
                commentLines=0
                whiteLines=0
                normal=0
                comment=False

                for i in lines:
                    i=i.strip()
                    if(i==''):
                        whiteLines=whiteLines+1
                    elif(i.startswith('/*') and False==i.endswith('*/')):
                        commentLines=commentLines+1
                        comment=True
                    elif(i.startswith('/*') and True==i.endswith('*/')):
                        commentLines=commentLines+1
                    elif(i.startswith('//')):
                        commentLines=commentLines+1
                    elif(True==comment):
                        commentLines=commentLines+1
                        #print i
                        if(i.endswith('*/')):
                            # print i
                            comment=False
                        else:
                            normal=normal+1
                            target_file.write('%s%d'%('normal is ',normal)+'\n')
                            target_file.write('%s%d'%('  whiteLines is ',whiteLines)+'\n')
                            target_file.write('%s%d'%('  commentLines is ',commentLines)+'\n')
                            commentAll=commentAll+commentLines
                            normalAll=normalAll+normal
                            whiteAll=whiteAll+whiteLines
                            target_file.write('all files line number:')
                            target_file.write('%d'%(commentAll+normalAll+whiteAll)+'\n')
                            target_file.write('common code:')
                            target_file.write('%d'%(normalAll)+'\n')
                            target_file.write('comment code:')
                            target_file.write('%d'%(commentAll)+'\n')
                            target_file.write('blank line number:')
                            target_file.write('%d'%(whiteAll)+'\n')


def get_process_files(root_dir,file_filter):
    """process all files in directory that match file_filter"""
    cur_dir=os.path.abspath(root_dir)
    file_list=os.listdir(cur_dir)
    #print file_list
    process_list=[]
    #process process_list return
    for file in file_list:
        fullfile=cur_dir+"\\"+file
        #print fullfile,
        if os.path.isfile(fullfile):
            #print 'is file',
            found_flag=False
            for filter in file_filter:
                if file.rfind(filter)!=-1:
                    #print 'match',
                    process_list.append(fullfile)
                    found_flag=True
                    #if found_flag==False:
                    #print# "pass this file"
                elif os.path.isdir(fullfile):
                    #print
                    dir_extra_list=get_process_files(fullfile,file_filter)
                    if len(dir_extra_list)!=0:
                        for x in dir_extra_list:
                            process_list.append(x)

            #print dir_extra_list
            #if len(dir_extra_list)!=0:
            #process_list.append(dir_extra_list)
        else:
            print 'not defined'
            return process_list

def count_files(root_dir,file_filter):
    process_list=get_process_files(root_dir,file_filter)

    target_filename=root_dir+"\\"+"result.txt"
    with open(target_filename,'w') as target_file:
        target_file.write("//////"+root_dir+"//////\n")

        analyze(target_file,process_list) # open analies
        target_file.close()
        print 'Result is generated in',target_filename


if __name__=='__main__':
    root_dir=sys.argv[1]
    count_files(root_dir,['.js'])
