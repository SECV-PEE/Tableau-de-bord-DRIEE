import pandas as pd
import numpy as np

###########################################################
######### Choisir l'annee pour trier les donnees ##########
#
annee_choisie = "2019"
#
###########################################################

df = pd.read_csv("equilibre-regional.csv")
ANNEE = list()
for index,row in df.iterrows():
    ANNEE.append(row["DATE"][:4])
df["ANNEE"] = ANNEE
df = df[df["ANNEE"] == annee_choisie]
regions = df["REGION"].unique()

production = list()
consommation = list()
pompage = list()
importee = list()
consommee_locale = list()
for i in regions:
    filter_region = df["REGION"] == i;
    df_temp = df.where(filter_region)
    consommation.append(df_temp.sum()["CONSOMMATION"])
    production.append(df_temp.sum()["PRODUCTION"])

for i in range(0, len(regions)):
    if production[i] > consommation[i]:
        pompage.append(production[i]-consommation[i])
        consommee_locale.append(consommation[i])
        importee.append(0)
    else:
        importee.append(consommation[i]-production[i])
        consommee_locale.append(production[i])
        pompage.append(0)



df_sort = pd.DataFrame(np.array([regions,consommee_locale,pompage,importee]).T,
                       columns=['Région', 'Consommee_locale', 'Pompage','importée'])

df_sort = df_sort.sort_values(by=["Consommee_locale"])
df_sort.to_csv("equilibre-regional-TDB.csv")
