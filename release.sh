#works to ssh & http link

version='0.0.2' 
description='test release'

token=$(git config --global github.token)
repo_full_name=$(git config --get remote.origin.url)
url=$repo_full_name
re="^(https|git)(:\/\/|@)([^\/:]+)[\/:]([^\/:]+)\/(.+).git$"

if [[ $url =~ $re ]]; then
protocol=${BASH_REMATCH[1]}
separator=${BASH_REMATCH[2]}
hostname=${BASH_REMATCH[3]}
user=${BASH_REMATCH[4]}
repo=${BASH_REMATCH[5]}
fi

generate_post_data()
{
  cat <<EOF
{
  "tag_name": "v$version",
  "target_commitish": "master",
  "name": "$version",
  "body": "$text",
  "draft": false,
  "prerelease": false
}
EOF
}

echo "https://api.github.com/repos/$user/$repo/releases?access_token=$token"

curl --data "$(generate_post_data)" "https://api.github.com/repos/$user/$repo/releases?access_token=$token"
read -p "Press enter to continue"