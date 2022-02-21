import os

os.system("del index.js")

final_scene = ""
final_js = ""
final_env = ""
base_index = ""

env_file = open("ENV.js")
final_env = env_file.read()
index_js = open("old_index.js")
base_index = index_js.read()


for file in os.listdir("./js"):
    f = open(f"./js/{file}", "r")
    final_js += f.read()
    final_js += "\n" 

for file in os.listdir("./scenes"):
    f = open(f"./scenes/{file}", "r")
    final_scene += f.read()
    final_scene += "\n" 

f = open("index.js", "w")
f.write(final_env)
f.write("\n")
f.write(final_scene)
f.write("\n")
f.write(base_index)
f.close()
