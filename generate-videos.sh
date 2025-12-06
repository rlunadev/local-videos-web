#!/bin/bash

# Script para generar el archivo JSON de videos
# Ejecutar desde la carpeta raíz del proyecto

VIDEOS_JSON="videos-data.json"

echo "{" > "$VIDEOS_JSON"
first_section=true

for dir in ./certified-cloud-practitioner-aws/*/; do
    section_name=$(basename "$dir" | sed 's/^[0-9]* - //')
    
    # Buscar archivos de video en la carpeta
    videos=()
    if [ -d "$dir" ]; then
        while IFS= read -r -d '' file; do
            videos+=("$file")
        done < <(find "$dir" -maxdepth 1 -iregex '.*\.\(mp4\|mkv\|webm\|avi\|mov\|flv\)$' -print0 | sort -z)
    fi
    
    # Si hay videos, agregar al JSON
    if [ ${#videos[@]} -gt 0 ]; then
        if [ "$first_section" = false ]; then
            echo "," >> "$VIDEOS_JSON"
        fi
        first_section=false
        
        echo "  \"$section_name\": [" >> "$VIDEOS_JSON"
        first_video=true
        
        for video in "${videos[@]}"; do
            video_name=$(basename "$video" | sed 's/\.[^.]*$//')
            video_path=$(cd "$(dirname "$video")" && pwd)/$(basename "$video")
            
            if [ "$first_video" = false ]; then
                echo "," >> "$VIDEOS_JSON"
            fi
            first_video=false
            
            # Escapar comillas en el nombre
            video_name_escaped=$(echo "$video_name" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')
            video_path_escaped=$(echo "$video_path" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')
            
            echo "    {" >> "$VIDEOS_JSON"
            echo "      \"name\": \"$video_name_escaped\"," >> "$VIDEOS_JSON"
            echo "      \"path\": \"$video_path_escaped\"" >> "$VIDEOS_JSON"
            echo -n "    }" >> "$VIDEOS_JSON"
        done
        
        echo "" >> "$VIDEOS_JSON"
        echo "  ]" >> "$VIDEOS_JSON"
    fi
done

echo "" >> "$VIDEOS_JSON"
echo "}" >> "$VIDEOS_JSON"

echo "Archivo $VIDEOS_JSON generado exitosamente"
